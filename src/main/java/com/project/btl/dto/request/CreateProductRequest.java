// File: com/project/btl/dto/request/CreateProductRequest.java
package com.project.btl.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class CreateProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, message = "Tên sản phẩm phải có ít nhất 3 ký tự")
    private String name;

    private String description;

    @NotNull(message = "ID danh mục không được để trống")
    private Long categoryId; // <- SỬA TỪ INTEGER THÀNH LONG

    @NotNull(message = "ID thương hiệu không được để trống")
    private Long brandId; // <- SỬA TỪ INTEGER THÀNH LONG

    @Valid
    @NotEmpty(message = "Sản phẩm phải có ít nhất 1 biến thể")
    private List<ProductVariantRequest> variants;
}