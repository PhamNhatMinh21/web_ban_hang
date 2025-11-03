// File: com/project/btl/controller/CartController.java
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
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal User user , @RequestBody CartItemRequest request){
        Integer userId = user.getUserId();
        CartResponse updatedCart = cartService.additemtoCart(userId, request);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getMyCart(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        Integer userId = user.getUserId();
        CartResponse cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @AuthenticationPrincipal User user,
            @RequestBody CartItemRequest request) {

        Integer userId = user.getUserId();
        CartResponse updatedCart = cartService.updateItemQuantity(userId, request);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove/{sku}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable String sku) {

        Integer userId = user.getUserId();
        CartResponse updatedCart = cartService.removeItemFromCart(userId, sku);
        return ResponseEntity.ok(updatedCart);
    }

    // === THÊM ENDPOINT NÀY ===
    /**
     * API để xóa sạch giỏ hàng (sau khi checkout)
     * Frontend gọi: DELETE http://localhost:8080/api/v1/cart/clear
     */
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        Integer userId = user.getUserId();
        cartService.clearCart(userId);
        // Trả về 200 OK không cần body
        return ResponseEntity.ok().build();
    }
}
