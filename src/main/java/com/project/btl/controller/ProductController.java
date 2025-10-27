package com.project.btl.controller;

import com.project.btl.model.Product;
import com.project.btl.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Import để phân quyền
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*") // Cho phép frontend gọi
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // --- AI CŨNG CÓ THỂ XEM ---
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // --- AI CŨNG CÓ THỂ XEM CHI TIẾT ---
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build(); // Trả về lỗi 404
        }
    }

    // --- CHỈ ADMIN MỚI ĐƯỢC TẠO SẢN PHẨM ---
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ai có ROLE_ADMIN
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // --- CHỈ ADMIN MỚI ĐƯỢC CẬP NHẬT ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ai có ROLE_ADMIN
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- CHỈ ADMIN MỚI ĐƯỢC XÓA ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ai có ROLE_ADMIN
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content
    }

    // --- AI CŨNG CÓ THỂ TÌM KIẾM ---
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProductsByName(name);
    }
}