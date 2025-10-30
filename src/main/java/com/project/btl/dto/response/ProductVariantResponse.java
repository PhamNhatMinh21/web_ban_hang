// File: com/project/btl/dto/response/ProductVariantResponse.java
package com.project.btl.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data
@Builder // Dùng Builder pattern để dễ dàng convert
public class ProductVariantResponse {
    private Integer variantId;
    private String name;
    private String sku;
    private BigDecimal price;
    private BigDecimal salePrice;
    private int stockQuantity;
}