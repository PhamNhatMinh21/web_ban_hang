package com.project.btl.controller;

import com.project.btl.dto.request.CartItemRequest;
import com.project.btl.dto.response.CartResponse;
import com.project.btl.model.entity.User;
import com.project.btl.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal User user , @RequestBody CartItemRequest request){
        Integer userId = user.getUserId();
        CartResponse updatedCart = cartService.additemtoCart(userId, request);
        return ResponseEntity.ok(updatedCart);
    }
}
