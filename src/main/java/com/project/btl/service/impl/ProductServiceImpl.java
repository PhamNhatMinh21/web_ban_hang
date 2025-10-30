// File: com/project/btl/service/impl/ProductServiceImpl.java
package com.project.btl.service.impl;
import com.project.btl.dto.request.CreateProductRequest;
import com.project.btl.dto.request.ProductVariantRequest;
import com.project.btl.dto.response.ProductResponse;
import com.project.btl.dto.response.ProductVariantResponse;
import com.project.btl.exception.ResourceNotFoundException;
import com.project.btl.model.entity.Brand;
import com.project.btl.model.entity.Category;
import com.project.btl.model.entity.Product;
import com.project.btl.model.entity.ProductVariant;
import com.project.btl.repository.BrandRepository;
import com.project.btl.repository.CategoryRepository;
import com.project.btl.repository.ProductRepository;
import com.project.btl.repository.ProductVariantRepository;
import com.project.btl.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Map; // BỔ SUNG
import java.util.Set;
import java.util.function.Function; // BỔ SUNG
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor // Sẽ tự động tiêm 4 repository bên dưới
public class ProductServiceImpl implements ProductService { // <- "implements" ProductService
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + productId));
        return convertToProductResponse(product);
    }
    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Category ID: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Brand ID: " + request.getBrandId()));
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        Set<ProductVariant> variants = new HashSet<>();
        for (ProductVariantRequest variantRequest : request.getVariants()) {
            if (productVariantRepository.findBySku(variantRequest.getSku()).isPresent()) {
                throw new IllegalArgumentException("SKU đã tồn tại: " + variantRequest.getSku());
            }
            ProductVariant variant = new ProductVariant();
            variant.setName(variantRequest.getName());
            variant.setSku(variantRequest.getSku());
            variant.setPrice(variantRequest.getPrice());
            variant.setSalePrice(variantRequest.getSalePrice());
            variant.setStockQuantity(variantRequest.getStockQuantity());
            variant.setProduct(product);
            variants.add(variant);
        }
        product.setVariants(variants);
        Product savedProduct = productRepository.save(product);
        return convertToProductResponse(savedProduct);
    }
    // --- SỬA LẠI HOÀN TOÀN HÀM UPDATE ---
// Sửa lỗi logic: Tránh xóa variant cũ (gây hỏng đơn hàng)
// Bằng cách dùng logic "diff/merge" (so sánh SKU)
    @Override
    @Transactional
    public ProductResponse updateProduct(Integer productId, CreateProductRequest request) {
// 1. Tìm các đối tượng liên quan
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + productId));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Category ID: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Brand ID: " + request.getBrandId()));
// 2. Cập nhật thông tin Product
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
// 3. Logic "Diff/Merge" cho Variants
// 3a. Map các variant mới (từ request) bằng SKU
        Map<String, ProductVariantRequest> newVariantsMap = request.getVariants().stream()
                .collect(Collectors.toMap(
                        ProductVariantRequest::getSku,
                        Function.identity(),
                        (existing, replacement) -> existing // Xử lý nếu có SKU trùng lặp trong request
                ));
// 3b. Map các variant cũ (từ DB) bằng SKU
        Map<String, ProductVariant> oldVariantsMap = product.getVariants().stream()
                .collect(Collectors.toMap(ProductVariant::getSku, Function.identity()));
        Set<ProductVariant> finalVariants = new HashSet<>();
// 3c. Duyệt qua các variant MỚI
        for (ProductVariantRequest newVariantReq : request.getVariants()) {
// Kiểm tra SKU đã tồn tại trong DB (của chính sản phẩm này) chưa
            ProductVariant existingVariant = oldVariantsMap.get(newVariantReq.getSku());
            if (existingVariant != null) {
// ĐÃ TỒN TẠI (UPDATE): Cập nhật thông tin
                existingVariant.setName(newVariantReq.getName());
                existingVariant.setPrice(newVariantReq.getPrice());
                existingVariant.setSalePrice(newVariantReq.getSalePrice());
                existingVariant.setStockQuantity(newVariantReq.getStockQuantity());
                finalVariants.add(existingVariant);
                oldVariantsMap.remove(newVariantReq.getSku()); // Xóa khỏi map cũ để đánh dấu là đã xử lý
            } else {
// CHƯA TỒN TẠI (CREATE): Tạo mới
// (Kiểm tra SKU toàn hệ thống)
                if (productVariantRepository.findBySku(newVariantReq.getSku()).isPresent()) {
                    throw new IllegalArgumentException("SKU đã tồn tại trên một sản phẩm khác: " + newVariantReq.getSku());
                }
                ProductVariant newVariant = new ProductVariant();
                newVariant.setName(newVariantReq.getName());
                newVariant.setSku(newVariantReq.getSku());
                newVariant.setPrice(newVariantReq.getPrice());
                newVariant.setSalePrice(newVariantReq.getSalePrice());
                newVariant.setStockQuantity(newVariantReq.getStockQuantity());
                newVariant.setProduct(product); // Gán vào product
                finalVariants.add(newVariant);
            }
        }
// 3d. Các variant còn lại trong oldVariantsMap là các variant cần XÓA
// product.getVariants().removeAll(oldVariantsMap.values()); // Dòng này sẽ kích hoạt orphanRemoval
// 4. Cập nhật lại danh sách variants của product
        product.getVariants().clear(); // Xóa sạch (an toàn vì đã có finalVariants)
        product.getVariants().addAll(finalVariants); // Thêm lại danh sách đã gộp/diff
        Product updatedProduct = productRepository.save(product);
        return convertToProductResponse(updatedProduct);
    }
    @Override
    @Transactional
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + productId));
        productRepository.delete(product);
    }
    // HÀM HELPER
    private ProductResponse convertToProductResponse(Product product) {
        List<ProductVariantResponse> variantResponses = null;
        if (product.getVariants() != null) {
            variantResponses = product.getVariants().stream()
                    .map(variant -> ProductVariantResponse.builder()
                            .variantId(variant.getVariantId())
                            .name(variant.getName())
                            .sku(variant.getSku())
                            .price(variant.getPrice())
                            .salePrice(variant.getSalePrice())
                            .stockQuantity(variant.getStockQuantity())
                            .build())
                    .collect(Collectors.toList());
        }
        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .variants(variantResponses)
                .build();
    }
}