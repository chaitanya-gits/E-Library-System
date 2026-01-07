package com.elibrary.service;

import com.elibrary.dto.LoanDTO;
import com.elibrary.entity.*;
import com.elibrary.exception.BusinessException;
import com.elibrary.exception.ResourceNotFoundException;
import com.elibrary.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private static final int MAX_LOANS_PER_USER = 5;
    private static final int DEFAULT_LOAN_PERIOD_DAYS = 14;

    public List<LoanDTO> getAllLoans() {
        return loanRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public LoanDTO getLoanById(String id) {
        return toDTO(findLoanById(id));
    }

    public List<LoanDTO> getLoansByUser(String userId) {
        return loanRepository.findByUser_Id(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LoanDTO> getActiveLoans() {
        return loanRepository.findByStatus(Loan.LoanStatus.ACTIVE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LoanDTO> getOverdueLoans() {
        return loanRepository.findByStatusAndDueDateBefore(Loan.LoanStatus.ACTIVE, LocalDate.now()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public LoanDTO checkoutBook(String bookId, String userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getActive()) {
            throw new BusinessException("User account is not active");
        }

        if (book.getAvailableCopies() <= 0) {
            throw new BusinessException("No copies available for checkout");
        }

        long activeLoans = loanRepository.countByUser_IdAndStatus(userId, Loan.LoanStatus.ACTIVE);
        if (activeLoans >= MAX_LOANS_PER_USER) {
            throw new BusinessException("User has reached maximum loan limit of " + MAX_LOANS_PER_USER);
        }

        // Update book availability
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        book.setAvailable(book.getAvailableCopies() > 0);
        bookRepository.save(book);

        // Create loan
        Loan loan = Loan.builder()
                .book(book)
                .user(user)
                .loanDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(DEFAULT_LOAN_PERIOD_DAYS))
                .status(Loan.LoanStatus.ACTIVE)
                .build();

        return toDTO(loanRepository.save(loan));
    }

    public LoanDTO returnBook(String loanId) {
        Loan loan = findLoanById(loanId);

        if (loan.getStatus() == Loan.LoanStatus.RETURNED) {
            throw new BusinessException("Book has already been returned");
        }

        // Update book availability
        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        book.setAvailable(true);
        bookRepository.save(book);

        // Update loan
        loan.setReturnDate(LocalDate.now());
        loan.setStatus(Loan.LoanStatus.RETURNED);

        return toDTO(loanRepository.save(loan));
    }

    public LoanDTO extendLoan(String loanId, int days) {
        Loan loan = findLoanById(loanId);

        if (loan.getStatus() != Loan.LoanStatus.ACTIVE) {
            throw new BusinessException("Can only extend active loans");
        }

        loan.setDueDate(loan.getDueDate().plusDays(days));
        return toDTO(loanRepository.save(loan));
    }

    private Loan findLoanById(String id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + id));
    }

    private LoanDTO toDTO(Loan loan) {
        return LoanDTO.builder()
                .id(loan.getId())
                .bookId(loan.getBook().getId())
                .bookTitle(loan.getBook().getTitle())
                .userId(loan.getUser().getId())
                .userName(loan.getUser().getName())
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .returnDate(loan.getReturnDate())
                .status(loan.getStatus().name())
                .build();
    }
}