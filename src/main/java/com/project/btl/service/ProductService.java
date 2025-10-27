package com.project.btl.service;

import com.project.btl.model.Product;
import com.project.btl.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        // Nếu không tìm thấy, trả về null. Controller sẽ xử lý 404 Not Found.
        return product.orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        // 1. Tìm sản phẩm cũ
        Product existingProduct = getProductById(id);

        // 2. Nếu tìm thấy
        if (existingProduct != null) {
            // 3. Cập nhật các trường
            existingProduct.setName(productDetails.getName());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setCategory(productDetails.getCategory());

            // 4. Lưu lại
            return productRepository.save(existingProduct);
        }
        // 5. Nếu không tìm thấy, trả về null
        return null;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> searchProductsByName(String keyword) {
        return productRepository.findByNameContaining(keyword);
    }
}