// File: com/project/btl/service/ProductService.java
package com.project.btl.service;
import com.project.btl.dto.request.CreateProductRequest;
import com.project.btl.dto.response.ProductResponse;
import java.util.List;
public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Integer productId);
    // --- Phương thức mới ---
    ProductResponse createProduct(CreateProductRequest request);
    // (Chúng ta sẽ làm UpdateProductRequest sau, tạm thời dùng CreateProductRequest)
    ProductResponse updateProduct(Integer productId, CreateProductRequest request);
    void deleteProduct(Integer productId);
}