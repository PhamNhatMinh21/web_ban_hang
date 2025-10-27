// File: com/project/btl/service/impl/ProductServiceImpl.java
package com.project.btl.service.impl;

// 1. IMPORT ĐẦY ĐỦ
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
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Sẽ tự động tiêm 4 repository bên dưới
public class ProductServiceImpl implements ProductService { // <- "implements" ProductService

    // 2. KHAI BÁO ĐẦY ĐỦ 4 REPOSITORY
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;

    // 3. TRIỂN KHAI CÁC HÀM TỪ INTERFACE
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

    @Override
    @Transactional
    public ProductResponse updateProduct(Integer productId, CreateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + productId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Category ID: " + request.getCategoryId()));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Brand ID: " + request.getBrandId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);

        product.getVariants().clear(); // Xóa các variant cũ

        Set<ProductVariant> newVariants = new HashSet<>();
        for (ProductVariantRequest variantRequest : request.getVariants()) {
            ProductVariant variant = new ProductVariant();
            variant.setName(variantRequest.getName());
            variant.setSku(variantRequest.getSku());
            variant.setPrice(variantRequest.getPrice());
            variant.setSalePrice(variantRequest.getSalePrice());
            variant.setStockQuantity(variantRequest.getStockQuantity());
            variant.setProduct(product);
            newVariants.add(variant);
        }
        product.getVariants().addAll(newVariants);

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

    // 4. HÀM HELPER (ĐỂ HẾT LỖI Ở HÀM getAllProducts)
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