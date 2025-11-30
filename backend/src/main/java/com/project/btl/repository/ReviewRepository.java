package com.project.btl.repository;

// Tự động import 2 DTOs mới
import com.project.btl.dto.response.RatingCountDto;
import com.project.btl.dto.response.ReviewStatsDto;
import com.project.btl.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    /**
     * Truy vấn để lấy thống kê chung (AVG và COUNT) cho 1 sản phẩm.
     * Sử dụng COALESCE để trả về 0.0 nếu chưa có đánh giá nào.
     */
    @Query("SELECT new com.project.btl.dto.response.ReviewStatsDto(COALESCE(AVG(r.rating), 0.0), COUNT(r.reviewId)) " +
            "FROM Review r WHERE r.product.productId = :productId")
    ReviewStatsDto findReviewStatsByProductId(@Param("productId") Integer productId);

    /**
     * Truy vấn để đếm số lượng review cho mỗi mức sao (1, 2, 3, 4, 5)
     * của 1 sản phẩm.
     */
    @Query("SELECT new com.project.btl.dto.response.RatingCountDto(r.rating, COUNT(r.rating)) " +
            "FROM Review r WHERE r.product.productId = :productId " +
            "GROUP BY r.rating")
    List<RatingCountDto> findRatingCountsByProductId(@Param("productId") Integer productId);
    List<Review> findByProductProductIdOrderByCreatedAtDesc(Integer productId);
}