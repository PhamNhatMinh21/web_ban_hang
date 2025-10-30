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
// ĐÃ SỬA: Thay /api/cart thành /api/v1/cart để khớp với SecurityConfig
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal User user , @RequestBody CartItemRequest request){
// User được lấy từ SecurityContextHolder thông qua @AuthenticationPrincipal (yêu cầu User entity phải implement UserDetails)
        Integer userId = user.getUserId();
        CartResponse updatedCart = cartService.additemtoCart(userId, request);
        return ResponseEntity.ok(updatedCart);
    }
// (Các API khác như get, update, delete item sẽ được thêm sau)
}