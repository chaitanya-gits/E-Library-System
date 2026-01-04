package com.elibrary.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private Integer publishedYear;
    private Boolean available;
    private Integer totalCopies;
    private Integer availableCopies;
    private Long categoryId;
    private String categoryName;
}
