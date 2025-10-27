package com.project.btl.controller;

import com.project.btl.model.Category;
import com.project.btl.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // AI CŨNG CÓ THỂ XEM
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // CHỈ ADMIN ĐƯỢC TẠO
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    // CHỈ ADMIN ĐƯỢC XÓA
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}