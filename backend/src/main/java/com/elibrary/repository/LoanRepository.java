package com.elibrary.repository;

import com.elibrary.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUser_Id(Long userId);

    List<Loan> findByBook_Id(Long bookId);

    List<Loan> findByStatus(Loan.LoanStatus status);

    List<Loan> findByUser_IdAndStatus(Long userId, Loan.LoanStatus status);

    List<Loan> findByBook_IdAndStatus(Long bookId, Loan.LoanStatus status);

    List<Loan> findByStatusAndDueDateBefore(Loan.LoanStatus status, LocalDate date);

    long countByUser_IdAndStatus(Long userId, Loan.LoanStatus status);
}
