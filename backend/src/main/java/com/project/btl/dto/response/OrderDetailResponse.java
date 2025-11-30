// File: com/project/btl/dto/response/OrderDetailResponse.java
package com.project.btl.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data
@Builder
public class OrderDetailResponse {
    private Integer variantId;
    private String productName; // Thêm tên sản phẩm cho dễ hiển thị
    private String variantName;
    private int quantity;
    private BigDecimal priceAtPurchase;
}