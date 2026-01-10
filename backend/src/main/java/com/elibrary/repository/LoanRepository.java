package com.elibrary.repository;

import com.elibrary.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUserId(Long userId);

    List<Loan> findByBookId(Long bookId);

    List<Loan> findByStatus(Loan.LoanStatus status);

    List<Loan> findByUserIdAndStatus(Long userId, Loan.LoanStatus status);

    List<Loan> findByBookIdAndStatus(Long bookId, Loan.LoanStatus status);

    List<Loan> findByStatusAndDueDateBefore(Loan.LoanStatus status, LocalDate date);

    long countByUserIdAndStatus(Long userId, Loan.LoanStatus status);
}
