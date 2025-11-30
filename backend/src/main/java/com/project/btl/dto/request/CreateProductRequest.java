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

    // Mình thấy bạn xóa field price ở đây để dùng price trong Variant, ok hợp lý.
    // private Double price;

    @NotNull(message = "ID danh mục không được để trống")
    private Integer categoryId;

    @NotNull(message = "ID thương hiệu không được để trống")
    private Integer brandId;

    @Valid
    @NotEmpty(message = "Sản phẩm phải có ít nhất 1 biến thể")
    private List<ProductVariantRequest> variants;

    // 👇👇👇 THIẾU CÁI NÀY NÈ BRUH 👇👇👇
    private List<String> imageUrls;
}