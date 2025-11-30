package com.project.btl.dto.response;

public class ReviewStatsDto {
    private Double averageRating;
    private Long totalReviews;

    // Constructor này sẽ được JPA gọi
    public ReviewStatsDto(Double averageRating, Long totalReviews) {
        // Nếu không có review nào, AVG sẽ là NULL, ta chuyển nó về 0.0
        this.averageRating = (averageRating == null) ? 0.0 : averageRating;
        this.totalReviews = totalReviews;
    }

    // Getters
    public Double getAverageRating() {
        return averageRating;
    }
    public Long getTotalReviews() {
        return totalReviews;
    }
}