// File: com/project/btl/dto/request/ProductVariantRequest.java
package com.project.btl.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class ProductVariantRequest {
    @NotBlank(message = "Tên biến thể không được để trống")
    private String name;
    @NotBlank(message = "SKU không được để trống")
    private String sku;
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price;
    private BigDecimal salePrice; // Có thể null
    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Tồn kho không thể âm")
    private int stockQuantity;
}