package com.elibrary.service;

import com.elibrary.dto.UserDTO;
import com.elibrary.entity.User;
import com.elibrary.exception.BusinessException;
import com.elibrary.exception.ResourceNotFoundException;
import com.elibrary.repository.LoanRepository;
import com.elibrary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(String id) {
        return toDTO(findUserById(id));
    }

    public List<UserDTO> searchUsers(String name) {
        return userRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("User with email " + dto.getEmail() + " already exists");
        }

        System.out.println("DEBUG: Creating user with email: " + dto.getEmail());
        System.out.println("DEBUG: Password from DTO: "
                + (dto.getPassword() != null ? "***" + dto.getPassword().length() + " chars***" : "NULL"));

        User user = toEntity(dto);
        System.out.println("DEBUG: Password after toEntity: "
                + (user.getPassword() != null ? "***" + user.getPassword().length() + " chars***" : "NULL"));

        // In a real app, hash the password here
        user.setPassword(dto.getPassword());
        System.out.println("DEBUG: Password after setPassword: "
                + (user.getPassword() != null ? "***" + user.getPassword().length() + " chars***" : "NULL"));

        User savedUser = userRepository.save(user);
        System.out.println("DEBUG: Password after save: "
                + (savedUser.getPassword() != null ? "***" + savedUser.getPassword().length() + " chars***" : "NULL"));

        return toDTO(savedUser);
    }

    public UserDTO login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        // In a real app, verify hash here
        if (!user.getPassword().equals(password)) {
            throw new BusinessException("Invalid email or password");
        }

        return toDTO(user);
    }

    public UserDTO resetPassword(String email, String newPassword) {
        System.out.println("DEBUG RESET: Email: " + email);
        System.out.println("DEBUG RESET: New password received: "
                + (newPassword != null ? "***" + newPassword.length() + " chars***" : "NULL"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User with email " + email + " not found"));

        System.out.println("DEBUG RESET: User found: " + user.getEmail());
        System.out.println("DEBUG RESET: Old password: "
                + (user.getPassword() != null ? "***" + user.getPassword().length() + " chars***" : "NULL"));

        // In a real app, hash the password here
        user.setPassword(newPassword);
        System.out.println("DEBUG RESET: Password after setPassword: "
                + (user.getPassword() != null ? "***" + user.getPassword().length() + " chars***" : "NULL"));

        User savedUser = userRepository.save(user);
        System.out.println("DEBUG RESET: Password after save: "
                + (savedUser.getPassword() != null ? "***" + savedUser.getPassword().length() + " chars***" : "NULL"));

        return toDTO(savedUser);
    }

    public UserDTO updateUser(String id, UserDTO dto) {
        User user = findUserById(id);
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setActive(dto.getActive());
        return toDTO(userRepository.save(user));
    }

    public void deleteUser(String id) {
        User user = findUserById(id);
        long activeLoans = loanRepository.countByUser_IdAndStatus(id, com.elibrary.entity.Loan.LoanStatus.ACTIVE);
        if (activeLoans > 0) {
            throw new BusinessException("Cannot delete user with active loans");
        }
        userRepository.delete(user);
    }

    private User findUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserDTO toDTO(User user) {
        int activeLoans = (int) loanRepository.countByUser_IdAndStatus(user.getId(),
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
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .active(true)
                .build();
    }
}