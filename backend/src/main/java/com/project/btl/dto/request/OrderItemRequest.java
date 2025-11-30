// File: com/project/btl/dto/request/OrderItemRequest.java
package com.project.btl.dto.request;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class OrderItemRequest {
    @NotNull(message = "ID biến thể không được để trống")
    private Integer variantId;
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải ít nhất là 1")
    private int quantity;
}