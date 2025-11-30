package com.project.btl.controller;

import com.project.btl.dto.request.CreateReviewRequest;
import com.project.btl.dto.response.ReviewResponseDto; // <-- IMPORT DTO MỚI
import com.project.btl.model.entity.Review;
import com.project.btl.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews") // Tiền tố chung, ví dụ: http://localhost:8080/api/v1/reviews
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /**
     * API Endpoint để lấy thống kê review cho một sản phẩm.
     * Frontend sẽ gọi: GET /api/v1/reviews/product/123/stats
     */
    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<Map<String, Object>> getReviewStatsForProduct(
            @PathVariable Integer productId) {

        // Gọi hàm service vừa tạo
        Map<String, Object> stats = reviewService.getReviewStatistics(productId);

        return ResponseEntity.ok(stats);
    }

    /**
     * API Endpoint để lấy danh sách review chi tiết.
     * Frontend sẽ gọi: GET /api/v1/reviews/product/123
     */
    // === SỬA CHỮ KÝ HÀM NÀY ===
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDto>> getProductReviewsList( // <-- SỬA TỪ List<Review>
                                                                          @PathVariable Integer productId
    ) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * API Endpoint để User tạo review mới cho sản phẩm
     * Frontend sẽ gọi: POST /api/v1/reviews/product/123
     */
    @PostMapping("/product/{productId}")
    public ResponseEntity<?> createProductReview(
            @PathVariable Integer productId,
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication // <-- Tự động lấy user đã đăng nhập
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cần đăng nhập để đánh giá");
        }

        // Lấy email (username) từ token
        String userEmail = authentication.getName();

        try {
            reviewService.createReview(productId, userEmail, request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Tạo đánh giá thành công");
        } catch (Exception e) {
            // Trả về lỗi chi tiết (ví dụ: user/product không tồn tại)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
