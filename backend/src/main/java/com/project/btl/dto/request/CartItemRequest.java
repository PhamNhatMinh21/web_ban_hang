// File: com/project/btl/dto/request/CartItemRequest.java
package com.project.btl.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CartItemRequest {
    private String variantID;
    private Integer quantity;
}