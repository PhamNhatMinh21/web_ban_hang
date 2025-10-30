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
// SỬA: Đổi từ Long sang Integer để khớp với Category.java
    private Integer categoryId;
    @NotNull(message = "ID thương hiệu không được để trống")
// SỬA: Đổi từ Long sang Integer để khớp với Brand.java
    private Integer brandId;
    @Valid
    @NotEmpty(message = "Sản phẩm phải có ít nhất 1 biến thể")
    private List<ProductVariantRequest> variants;
}