package com.project.btl.dto.response;

import com.project.btl.model.entity.Review;
import com.project.btl.model.entity.User; // Import User để dùng

import java.time.format.DateTimeFormatter;

/**
 * Đây là DTO để trả về danh sách Review cho Frontend.
 * Nó chỉ chứa các trường Frontend cần, và ngắt tham chiếu vòng (circular reference).
 * Tên các trường (id, author, date...) được đặt CỐ TÌNH giống hệt
 * với những gì component ProductReviews.tsx đang dùng.
 */
public class ReviewResponseDto {

    private Integer id;
    private Byte rating;
    private String comment;
    private String date; // Frontend dùng kiểu string
    private String author; // Frontend dùng kiểu string

    // Constructor để chuyển đổi từ Entity sang DTO
    public ReviewResponseDto(Review review) {
        this.id = review.getReviewId();
        this.rating = review.getRating();
        this.comment = review.getComment();

        // Chuyển createdAt (LocalDateTime) sang String mà Frontend đọc được
        if (review.getCreatedAt() != null) {
            // Bạn có thể đổi định dạng (pattern) nếu muốn
            this.date = review.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } else {
            this.date = ""; // Hoặc một ngày mặc định
        }

        // === ĐÂY LÀ PHẦN SỬA LỖI TỪ ẢNH CỦA BẠN ===
        User user = review.getUser();
        if (user != null) {
            // Lấy firstName và lastName từ file User.java của bạn
            String firstName = user.getFirstName() != null ? user.getFirstName() : "";
            String lastName = user.getLastName() != null ? user.getLastName() : "";

            this.author = (firstName + " " + lastName).trim();

            // Dự phòng nếu tên rỗng, thì dùng email
            if (this.author.isEmpty()) {
                this.author = user.getEmail();
            }
        } else {
            this.author = "Người dùng ẩn";
        }
    }

    // --- Jackson (thư viện JSON) cần các hàm Getters để đọc ---

    public Integer getId() {
        return id;
    }

    public Byte getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public String getDate() {
        return date;
    }

    public String getAuthor() {
        return author;
    }
}
