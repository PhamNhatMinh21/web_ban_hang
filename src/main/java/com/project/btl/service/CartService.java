package com.project.btl.service;
import com.project.btl.dto.request.CartItemRequest;
import com.project.btl.dto.response.CartResponse;
import com.project.btl.model.entity.Cart;
public interface CartService {
    CartResponse additemtoCart(Integer userId, CartItemRequest request);
}