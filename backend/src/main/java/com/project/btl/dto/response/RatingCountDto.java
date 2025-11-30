package com.project.btl.dto.response;

public class RatingCountDto {
    private Byte rating; // Phải khớp với kiểu 'byte' trong Review entity
    private Long count;

    // Constructor này sẽ được JPA gọi
    public RatingCountDto(Byte rating, Long count) {
        this.rating = rating;
        this.count = count;
    }

    // Getters
    public Byte getRating() {
        return rating;
    }
    public Long getCount() {
        return count;
    }
}