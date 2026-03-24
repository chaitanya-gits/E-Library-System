package com.elibrary.service;

import com.elibrary.dto.UserDTO;
import com.elibrary.entity.User;
import com.elibrary.exception.BusinessException;
import com.elibrary.exception.ResourceNotFoundException;
import com.elibrary.repository.LoanRepository;
import com.elibrary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private static final Pattern STRONG_PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[!@#$%^&*])(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$");

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return toDTO(findUserById(id));
    }

    public List<UserDTO> searchUsers(String name) {
        return userRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO dto) {
        String normalizedEmail = normalizeEmail(dto.getEmail());

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BusinessException("User with email " + normalizedEmail + " already exists");
        }

        validatePassword(dto.getPassword());

        User user = toEntity(dto);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        try {
            User savedUser = userRepository.save(user);
            return toDTO(savedUser);
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException("User with email " + normalizedEmail + " already exists");
        }
    }

    public UserDTO findOrCreateGoogleUser(String name, String email) {
        String normalizedEmail = normalizeEmail(email);

        if (isBlank(normalizedEmail)) {
            throw new BusinessException("Google account did not provide an email address");
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> userRepository.save(User.builder()
                        .name(isBlank(name) ? email : name)
                        .email(normalizedEmail)
                        .active(true)
                        .build()));

        if (isBlank(user.getName()) && !isBlank(name)) {
            user.setName(name);
            user = userRepository.save(user);
        }

        return toDTO(user);
    }
    public UserDTO login(String email, String password) {
        String normalizedEmail = normalizeEmail(email);

        if (isBlank(normalizedEmail) || isBlank(password)) {
            throw new BusinessException("Email and password are required");
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("Invalid email or password");
        }

        return toDTO(user);
    }

    public UserDTO resetPassword(String email, String newPassword) {
        String normalizedEmail = normalizeEmail(email);

        if (isBlank(normalizedEmail)) {
            throw new BusinessException("Email is required");
        }

        validatePassword(newPassword);

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BusinessException("User with email " + normalizedEmail + " not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        User savedUser = userRepository.save(user);

        return toDTO(savedUser);
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = findUserById(id);

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setActive(dto.getActive());

        if (dto.getEmail() != null) {
            String normalizedEmail = normalizeEmail(dto.getEmail());
            if (!normalizedEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                throw new BusinessException("Email " + normalizedEmail + " is already in use");
            }
            user.setEmail(normalizedEmail);
        }

        return toDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = findUserById(id);
        long activeLoans = loanRepository.countByUserIdAndStatus(id, com.elibrary.entity.Loan.LoanStatus.ACTIVE);
        if (activeLoans > 0) {
            throw new BusinessException("Cannot delete user with active loans");
        }
        userRepository.delete(user);
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserDTO toDTO(User user) {
        int activeLoans = (int) loanRepository.countByUserIdAndStatus(user.getId(),
                com.elibrary.entity.Loan.LoanStatus.ACTIVE);
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .membershipDate(user.getMembershipDate())
                .active(user.getActive())
                .activeLoans(activeLoans)
                .build();
    }

    private User toEntity(UserDTO dto) {
        return User.builder()
                .name(dto.getName())
                .email(normalizeEmail(dto.getEmail()))
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .active(true)
                .build();
    }

    private void validatePassword(String password) {
        if (isBlank(password)) {
            throw new BusinessException("Password is required");
        }
        if (!STRONG_PASSWORD_PATTERN.matcher(password).matches()) {
            throw new BusinessException("Password must be at least 8 characters and include a letter, a number, and a symbol (!@#$%^&*)");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}

