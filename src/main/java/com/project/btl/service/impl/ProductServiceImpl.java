// File: com/project/btl/service/impl/ProductServiceImpl.java
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
    private final ProductImageRepository productImageRepository; // <--- 1. TIÊM REPO ẢNH VÀO
    private final ReviewService reviewService;

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
        // 1. Tìm Category & Brand
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Category ID: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Brand ID: " + request.getBrandId()));

        // 2. Tạo Product
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);

        // 3. Xử lý Variants (như cũ)
        Set<ProductVariant> variants = new HashSet<>();
        if (request.getVariants() != null) {
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
        }
        product.setVariants(variants);

        // 4. Lưu Product trước để có ID
        Product savedProduct = productRepository.save(product);

        // --- 5. XỬ LÝ LƯU ẢNH (MỚI THÊM) ---
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage();
                img.setProduct(savedProduct);
                img.setImageUrl(request.getImageUrls().get(i));
                img.setSortOrder(i);
                img.setThumbnail(i == 0); // Cái đầu tiên là Thumbnail
                images.add(img);
            }
            productImageRepository.saveAll(images);
            savedProduct.setImages(images); // Update lại object hiện tại để trả về client
        }

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

        // --- Xử lý Variants (Code cũ của bạn) ---
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
                    finalVariants.add(existingVariant);
                    oldVariantsMap.remove(newVariantReq.getSku());
                } else {
                    if (productVariantRepository.findBySku(newVariantReq.getSku()).isPresent()) {
                        throw new IllegalArgumentException("SKU đã tồn tại: " + newVariantReq.getSku());
                    }
                    ProductVariant newVariant = new ProductVariant();
                    newVariant.setName(newVariantReq.getName());
                    newVariant.setSku(newVariantReq.getSku());
                    newVariant.setPrice(newVariantReq.getPrice());
                    newVariant.setSalePrice(newVariantReq.getSalePrice());
                    newVariant.setStockQuantity(newVariantReq.getStockQuantity());
                    newVariant.setProduct(product);
                    finalVariants.add(newVariant);
                }
            }
            product.getVariants().clear();
            product.getVariants().addAll(finalVariants);
        }

        // --- XỬ LÝ CẬP NHẬT ẢNH (MỚI THÊM) ---
        // Logic đơn giản: Nếu có gửi list ảnh mới -> Xóa hết ảnh cũ đi lưu lại từ đầu
        if (request.getImageUrls() != null) {
            List<ProductImage> currentImages = product.getImages();
            if (currentImages == null) {
                currentImages = new ArrayList<>();
                product.setImages(currentImages);
            }

            // B. Xóa sạch ruột bên trong (Hibernate sẽ tự động xóa record trong DB)
            currentImages.clear();

            // C. Thêm ảnh mới vào cái list cũ đó
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage();
                img.setProduct(product); // Gắn ngược lại cha
                img.setImageUrl(request.getImageUrls().get(i));
                img.setSortOrder(i);
                img.setThumbnail(i == 0); // Cái đầu tiên là thumbnail

                currentImages.add(img); // ADD vào list cũ, đừng set list mới
            }
            // Không cần gọi productImageRepository.saveAll nữa,
            // khi lưu 'product', Hibernate sẽ tự lưu đám con này nhờ Cascade.ALL
        }

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

    // --- HÀM HELPER ĐÃ ĐƯỢC UPDATE ---
    private ProductResponse convertToProductResponse(Product product) {
        // 1. Map Variants
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
                            .build())
                    .collect(Collectors.toList());
        }

        // 2. Map Reviews Stats
        Map<String, Object> stats = reviewService.getReviewStatistics(product.getProductId());
        Double avgRating = (Double) stats.get("averageRating");
        Long totalRev = (Long) stats.get("totalReviews");

        // 3. MAP ẢNH (MỚI THÊM)
        String thumbnail = null;
        List<String> gallery = new ArrayList<>();

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            // Lấy thumbnail (ảnh có isThumbnail=true hoặc ảnh đầu tiên)
            thumbnail = product.getImages().stream()
                    .filter(ProductImage::isThumbnail)
                    .findFirst()
                    .map(ProductImage::getImageUrl)
                    .orElse(product.getImages().get(0).getImageUrl());

            // Lấy list tất cả link ảnh
            gallery = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
        }

        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .variants(variantResponses)
                .averageRating(avgRating)
                .totalReviews(totalRev)
                .thumbnail(thumbnail) // <--- Trả về thumbnail
                .gallery(gallery)     // <--- Trả về list ảnh
                .build();
    }
}