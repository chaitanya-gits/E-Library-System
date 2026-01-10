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

        public UserDTO getUserById(Long id) {
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

                User user = toEntity(dto);
                // In a real app, hash the password here
                user.setPassword(dto.getPassword());

                User savedUser = userRepository.save(user);

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
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException("User with email " + email + " not found"));

                // In a real app, hash the password here
                user.setPassword(newPassword);

                User savedUser = userRepository.save(user);

                return toDTO(savedUser);
        }

        public UserDTO updateUser(Long id, UserDTO dto) {
                User user = findUserById(id);

                // Update name, phone, address, and active status
                user.setName(dto.getName());
                user.setPhone(dto.getPhone());
                user.setAddress(dto.getAddress());
                user.setActive(dto.getActive());

                // Update email if provided and different from current email
                if (dto.getEmail() != null) {
                        // Only check for duplicates if email is actually changing
                        if (!dto.getEmail().equals(user.getEmail())) {
                                if (userRepository.existsByEmail(dto.getEmail())) {
                                        throw new BusinessException("Email " + dto.getEmail() + " is already in use");
                                }
                        }
                        user.setEmail(dto.getEmail());
                }

                return toDTO(userRepository.save(user));
        }

        public void deleteUser(Long id) {
                User user = findUserById(id);
                long activeLoans = loanRepository.countByUserIdAndStatus(id,
                                com.elibrary.entity.Loan.LoanStatus.ACTIVE);
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
                                .email(dto.getEmail())
                                .password(dto.getPassword())
                                .phone(dto.getPhone())
                                .address(dto.getAddress())
                                .active(true)
                                .build();
        }
}