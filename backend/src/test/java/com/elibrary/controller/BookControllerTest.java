package com.elibrary.controller;

import com.elibrary.dto.BookDTO;
import com.elibrary.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookController.class)
@AutoConfigureMockMvc(addFilters = false)
class BookControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private BookService bookService;

        @Autowired
        private ObjectMapper objectMapper;

        private BookDTO testBookDTO;

        @BeforeEach
        void setUp() {
                testBookDTO = BookDTO.builder()
                                .id(1L)
                                .title("The Great Gatsby")
                                .author("F. Scott Fitzgerald")
                                .isbn("978-0743273565")
                                .publishedYear(1925)
                                .available(true)
                                .totalCopies(3)
                                .availableCopies(2)
                                .categoryId(1L)
                                .categoryName("Fiction")
                                .build();
        }

        @Test
        void getAllBooks_ShouldReturnListOfBooks() throws Exception {
                List<BookDTO> books = Arrays.asList(testBookDTO);
                when(bookService.getAllBooks()).thenReturn(books);

                mockMvc.perform(get("/api/books"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].title").value("The Great Gatsby"))
                                .andExpect(jsonPath("$[0].author").value("F. Scott Fitzgerald"));
        }

        @Test
        void getBookById_ShouldReturnBook() throws Exception {
                when(bookService.getBookById(1L)).thenReturn(testBookDTO);

                mockMvc.perform(get("/api/books/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("The Great Gatsby"))
                                .andExpect(jsonPath("$.categoryName").value("Fiction"));
        }

        @Test
        void createBook_ShouldReturnCreatedBook() throws Exception {
                BookDTO inputDTO = BookDTO.builder()
                                .title("New Book")
                                .author("Test Author")
                                .build();

                BookDTO savedDTO = BookDTO.builder()
                                .id(2L)
                                .title("New Book")
                                .author("Test Author")
                                .available(true)
                                .build();

                when(bookService.createBook(any(BookDTO.class))).thenReturn(savedDTO);

                mockMvc.perform(post("/api/books")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(Objects.requireNonNull(objectMapper.writeValueAsString(inputDTO))))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id").value(2))
                                .andExpect(jsonPath("$.title").value("New Book"));
        }

        @Test
        void searchBooks_ShouldReturnMatchingBooks() throws Exception {
                when(bookService.searchBooks("Gatsby")).thenReturn(Arrays.asList(testBookDTO));

                mockMvc.perform(get("/api/books/search?keyword=Gatsby"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].title").value("The Great Gatsby"));
        }
}
