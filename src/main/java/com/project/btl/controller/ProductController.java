package com.project.btl.controller;
import com.project.btl.dto.request.CreateProductRequest; // BỔ SUNG
import com.project.btl.dto.response.ProductResponse;
import com.project.btl.service.ProductService;
import jakarta.validation.Valid; // BỔ SUNG
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // BỔ SUNG
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // BỔ SUNG
import org.springframework.web.bind.annotation.*; // BỔ SUNG
import java.util.List;
@RestController
@RequestMapping("/api/v1/products") // Tiền tố chung cho API sản phẩm
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    /**
     * API để lấy tất cả sản phẩm
     * Frontend gọi: GET http://localhost:8080/api/v1/products
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products); // Trả về 200 OK
    }
    /**
     * API để lấy chi tiết 1 sản phẩm theo ID
     * Frontend gọi: GET http://localhost:8080/api/v1/products/1 (ví dụ)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product); // Trả về 200 OK
    }
// --- BỔ SUNG CÁC API ADMIN (Create, Update, Delete) ---
    /**
     * API để Admin tạo sản phẩm mới
     * Frontend gọi: POST http://localhost:8080/api/v1/products
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Đảm bảo chỉ Admin
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse newProduct = productService.createProduct(request);
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }
    /**
     * API để Admin cập nhật sản phẩm
     * Frontend gọi: PUT http://localhost:8080/api/v1/products/1
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(updatedProduct);
    }
    /**
     * API để Admin xóa sản phẩm
     * Frontend gọi: DELETE http://localhost:8080/api/v1/products/1
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}