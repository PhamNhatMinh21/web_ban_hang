package com.project.btl.service;

import com.project.btl.dto.request.CartItemRequest;
import com.project.btl.dto.response.CartResponse;
import org.springframework.stereotype.Service;


public interface CartService {

    CartResponse additemtoCart(Long userId, CartItemRequest request);
    CartResponse removeItemFromCart(Long userId, String variantID);
    CartResponse updateItemQuantity(Long userId, String variantID, Integer quantity);
}
