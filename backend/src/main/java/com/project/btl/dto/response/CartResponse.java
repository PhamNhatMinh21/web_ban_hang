// File: com/project/btl/dto/response/CartResponse.java
package com.project.btl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data // <-- Thêm @Data (tự tạo getter/setter)
@Builder // <-- Thêm @Builder (để fix lỗi 'builder')
@NoArgsConstructor // <-- Thêm constructor rỗng
@AllArgsConstructor
public class CartResponse {
    public Integer totalItems;
    public List<CartItemResponse> items;
}