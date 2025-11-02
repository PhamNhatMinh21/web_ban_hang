// File: com/project/btl/service/CartService.java
package com.project.btl.service;
import com.project.btl.dto.request.CartItemRequest;
import com.project.btl.dto.response.CartResponse;
import com.project.btl.model.entity.Cart;
public interface CartService {
    CartResponse additemtoCart(Integer userId, CartItemRequest request);
    CartResponse getCart(Integer userId);
    CartResponse updateItemQuantity(Integer userId, CartItemRequest request);

    // Dùng SKU (string) để xóa
    CartResponse removeItemFromCart(Integer userId, String sku);
}