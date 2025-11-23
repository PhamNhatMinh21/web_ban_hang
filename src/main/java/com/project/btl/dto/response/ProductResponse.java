// File: com/project/btl/dto/response/ProductResponse.java
package com.project.btl.dto.response;
import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data
@Builder
public class ProductResponse {
    private Integer productId;
    private String name;
    private String description;
    private String categoryName;
    private String brandName;
    private List<ProductVariantResponse> variants;
    private Double averageRating;
    private Long totalReviews;
    private String thumbnail;      // Ảnh đại diện
    private List<String> gallery;
}