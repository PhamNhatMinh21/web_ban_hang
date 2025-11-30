package com.project.btl.service;

import com.project.btl.dto.request.CreateReviewRequest;
import com.project.btl.dto.response.RatingCountDto;
import com.project.btl.dto.response.ReviewStatsDto;
import com.project.btl.dto.response.ReviewResponseDto; // <-- IMPORT DTO MỚI
import com.project.btl.model.entity.Product;
import com.project.btl.model.entity.Review;
import com.project.btl.model.entity.User;
import com.project.btl.repository.ProductRepository;
import com.project.btl.repository.ReviewRepository;
import com.project.btl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors; // <-- IMPORT THÊM

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    /**
     * Lấy tất cả thống kê (trung bình, tổng, và đếm theo sao)
     * cho một sản phẩm.
     */
    public Map<String, Object> getReviewStatistics(Integer productId) {

        // 1. Lấy thống kê chung (Avg, Total)
        ReviewStatsDto stats = reviewRepository.findReviewStatsByProductId(productId);

        // 2. Lấy thống kê chi tiết (số lượng mỗi sao)
        List<RatingCountDto> ratingCounts = reviewRepository.findRatingCountsByProductId(productId);

        // 3. Gộp kết quả lại để trả về cho API
        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", stats.getAverageRating());
        response.put("totalReviews", stats.getTotalReviews());
        response.put("ratingCounts", ratingCounts); // Đây là 1 list

        return response;
    }

    public void createReview(Integer productId, String userEmail, CreateReviewRequest request) {
        // 1. Tìm user bằng email (lấy từ token)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + userEmail));

        // 2. Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // 3. Tạo Entity Review mới
        Review newReview = new Review();
        newReview.setProduct(product);
        newReview.setUser(user);
        newReview.setRating(request.getRating());
        newReview.setComment(request.getComment());
        // (createdAt sẽ tự động được set bởi @PrePersist)

        // 4. Lưu vào database
        reviewRepository.save(newReview);

    }

    // === SỬA HÀM NÀY ===
    /**
     * Lấy danh sách review (đã chuyển sang DTO) cho sản phẩm.
     */
    public List<ReviewResponseDto> getReviewsForProduct(Integer productId) {
        // 1. Lấy List<Review> (Entity) từ repo
        List<Review> reviews = reviewRepository.findByProductProductIdOrderByCreatedAtDesc(productId);

        // 2. Chuyển đổi (map) sang List<ReviewResponseDto>
        return reviews.stream()
                .map(ReviewResponseDto::new) // Gọi constructor của DTO
                .collect(Collectors.toList());
    }
}
