package com.project.btl.service.impl;

import com.project.btl.dto.request.CartItemRequest;
import com.project.btl.dto.response.CartResponse;
import com.project.btl.service.CartService;
import com.project.btl.model.entity.Cart;
import com.project.btl.model.entity.CartItem;
import com.project.btl.model.entity.ProductVariant;
import com.project.btl.model.entity.User;
import com.project.btl.repository.CartItemRepository;
import com.project.btl.repository.CartRepository;
import com.project.btl.repository.ProductVariantRepository;
import com.project.btl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CartResponse additemtoCart(Integer userId, CartItemRequest request) {
        Cart cart = findOrCreateCart(userId);

        ProductVariant variant = variantRepository.findBySku(request.getVariantID())
                .orElseThrow(() -> new RuntimeException("Product Variant (SKU) not found"));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndVariant(cart, variant);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setVariant(variant);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }

        // SỬA: Dùng hàm tính tổng mới
        return buildCartResponse(cart);
    }

    private Cart findOrCreateCart(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    // SỬA: Thay đổi hàm tính tổng để sử dụng Repository mới
    private CartResponse buildCartResponse(Cart cart) {
        // Sử dụng truy vấn trực tiếp từ Repository để tính tổng
        Integer total = cartItemRepository.sumTotalItemsByCartId(cart.getCartId());

        CartResponse response = new CartResponse();
        // Nếu total là NULL (giỏ hàng trống), gán 0
        response.totalItems = (total != null) ? total : 0;
        return response;
    }
}