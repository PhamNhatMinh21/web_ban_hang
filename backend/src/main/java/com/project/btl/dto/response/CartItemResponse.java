package com.project.btl.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class CartItemResponse {
    private Integer variantId;
    private String sku;
    private String name;        // Tên (ví dụ: "Gold Standard 5Lbs Choc")
    private BigDecimal price;   // Giá của 1 sản phẩm
    private int quantity;
    private String image;       // (Tạm thời, bạn có thể thêm sau)
}