package com.elibrary.service;

import com.elibrary.dto.CategoryDTO;
import com.elibrary.entity.Category;
import com.elibrary.exception.BusinessException;
import com.elibrary.exception.ResourceNotFoundException;
import com.elibrary.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final com.elibrary.repository.BookRepository bookRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(String id) {
        return toDTO(findCategoryById(id));
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BusinessException("Category with name " + dto.getName() + " already exists");
        }
        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return toDTO(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(String id, CategoryDTO dto) {
        Category category = findCategoryById(id);

        // Check for duplicate name if name is being changed
        if (dto.getName() != null && !java.util.Objects.equals(dto.getName(), category.getName())) {
            if (categoryRepository.existsByName(dto.getName())) {
                throw new BusinessException("Category with name " + dto.getName() + " already exists");
            }
        }

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return toDTO(categoryRepository.save(category));
    }

    public void deleteCategory(String id) {
        Category category = findCategoryById(id);
        if (!bookRepository.findByCategory_Id(id).isEmpty()) {
            throw new BusinessException("Cannot delete category with existing books");
        }
        categoryRepository.delete(category);
    }

    private Category findCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryDTO toDTO(Category category) {
        int bookCount = bookRepository.findByCategory_Id(category.getId()).size();
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .bookCount(bookCount)
                .build();
    }
}
