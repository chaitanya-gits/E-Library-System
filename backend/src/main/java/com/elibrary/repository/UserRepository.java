package com.elibrary.repository;

import com.elibrary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    List<User> findByNameContainingIgnoreCase(String name);

    List<User> findByActiveTrue();

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);
}
