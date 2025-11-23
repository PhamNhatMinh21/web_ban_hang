package com.project.btl.service.impl;

import com.project.btl.dto.request.CreateProductRequest;
import com.project.btl.dto.request.ProductVariantRequest;
import com.project.btl.dto.response.ProductResponse;
import com.project.btl.dto.response.ProductVariantResponse;
import com.project.btl.exception.ResourceNotFoundException;
import com.project.btl.model.entity.*;
import com.project.btl.repository.*;
import com.project.btl.service.ProductService;
import com.project.btl.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewService reviewService;

    // --- CÁC HÀM GET ---
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::convertToProductResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + productId));
        return convertToProductResponse(product);
    }

    // --- HÀM CREATE (Đã thêm logic setImageUrl) ---
    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + request.getBrandId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);

        Set<ProductVariant> variants = new HashSet<>();
        if (request.getVariants() != null) {
            for (ProductVariantRequest variantRequest : request.getVariants()) {
                if (productVariantRepository.findBySku(variantRequest.getSku()).isPresent()) {
                    throw new IllegalArgumentException("SKU existed: " + variantRequest.getSku());
                }
                ProductVariant variant = new ProductVariant();
                variant.setName(variantRequest.getName());
                variant.setSku(variantRequest.getSku());
                variant.setPrice(variantRequest.getPrice());
                variant.setSalePrice(variantRequest.getSalePrice());
                variant.setStockQuantity(variantRequest.getStockQuantity());

                // 👇 LƯU ẢNH BIẾN THỂ
                variant.setImageUrl(variantRequest.getImageUrl());

                variant.setProduct(product);
                variants.add(variant);
            }
        }
        product.setVariants(variants);

        Product savedProduct = productRepository.save(product);

        // Lưu ảnh chung (Gallery)
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage();
                img.setProduct(savedProduct);
                img.setImageUrl(request.getImageUrls().get(i));
                img.setSortOrder(i);
                img.setThumbnail(i == 0);
                images.add(img);
            }
            productImageRepository.saveAll(images);
            savedProduct.setImages(images);
        }

        return convertToProductResponse(savedProduct);
    }

    // --- HÀM UPDATE (Đã thêm logic setImageUrl) ---
    @Override
    @Transactional
    public ProductResponse updateProduct(Integer productId, CreateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
            product.setBrand(brand);
        }
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());

        // Update Variants
        if (request.getVariants() != null) {
            Map<String, ProductVariantRequest> newVariantsMap = request.getVariants().stream()
                    .collect(Collectors.toMap(ProductVariantRequest::getSku, Function.identity(), (e, r) -> e));
            Map<String, ProductVariant> oldVariantsMap = product.getVariants().stream()
                    .collect(Collectors.toMap(ProductVariant::getSku, Function.identity()));

            Set<ProductVariant> finalVariants = new HashSet<>();

            for (ProductVariantRequest newVariantReq : request.getVariants()) {
                ProductVariant existingVariant = oldVariantsMap.get(newVariantReq.getSku());
                if (existingVariant != null) {
                    existingVariant.setName(newVariantReq.getName());
                    existingVariant.setPrice(newVariantReq.getPrice());
                    existingVariant.setSalePrice(newVariantReq.getSalePrice());
                    existingVariant.setStockQuantity(newVariantReq.getStockQuantity());
                    // 👇 UPDATE ẢNH BIẾN THỂ
                    existingVariant.setImageUrl(newVariantReq.getImageUrl());

                    finalVariants.add(existingVariant);
                    oldVariantsMap.remove(newVariantReq.getSku());
                } else {
                    if (productVariantRepository.findBySku(newVariantReq.getSku()).isPresent()) {
                        throw new IllegalArgumentException("SKU existed: " + newVariantReq.getSku());
                    }
                    ProductVariant newVariant = new ProductVariant();
                    newVariant.setName(newVariantReq.getName());
                    newVariant.setSku(newVariantReq.getSku());
                    newVariant.setPrice(newVariantReq.getPrice());
                    newVariant.setSalePrice(newVariantReq.getSalePrice());
                    newVariant.setStockQuantity(newVariantReq.getStockQuantity());
                    // 👇 LƯU ẢNH BIẾN THỂ MỚI
                    newVariant.setImageUrl(newVariantReq.getImageUrl());

                    newVariant.setProduct(product);
                    finalVariants.add(newVariant);
                }
            }
            product.getVariants().clear();
            product.getVariants().addAll(finalVariants);
        }

        // Update Gallery Images (Fix lỗi Orphan Removal)
        if (request.getImageUrls() != null) {
            List<ProductImage> currentImages = product.getImages();
            if (currentImages == null) {
                currentImages = new ArrayList<>();
                product.setImages(currentImages);
            }
            currentImages.clear(); // Xóa ruột

            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(request.getImageUrls().get(i));
                img.setSortOrder(i);
                img.setThumbnail(i == 0);
                currentImages.add(img); // Add mới vào vỏ cũ
            }
        }

        return convertToProductResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Integer productId) {
        productRepository.deleteById(productId);
    }

    // --- CONVERTER (Đã thêm map imageUrl) ---
    private ProductResponse convertToProductResponse(Product product) {
        List<ProductVariantResponse> variantResponses = new ArrayList<>();
        if (product.getVariants() != null) {
            variantResponses = product.getVariants().stream()
                    .map(variant -> ProductVariantResponse.builder()
                            .variantId(variant.getVariantId())
                            .name(variant.getName())
                            .sku(variant.getSku())
                            .price(variant.getPrice())
                            .salePrice(variant.getSalePrice())
                            .stockQuantity(variant.getStockQuantity())
                            // 👇 TRẢ VỀ LINK ẢNH BIẾN THỂ
                            .imageUrl(variant.getImageUrl())
                            .build())
                    .collect(Collectors.toList());
        }

        Map<String, Object> stats = reviewService.getReviewStatistics(product.getProductId());

        String thumbnail = null;
        List<String> gallery = new ArrayList<>();
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            thumbnail = product.getImages().get(0).getImageUrl();
            gallery = product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
        }

        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
                .brandName(product.getBrand() != null ? product.getBrand().getName() : "")
                .variants(variantResponses)
                .averageRating((Double) stats.get("averageRating"))
                .totalReviews((Long) stats.get("totalReviews"))
                .thumbnail(thumbnail)
                .gallery(gallery)
                .build();
    }
}