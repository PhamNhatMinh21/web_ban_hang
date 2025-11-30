// File: com/project/btl/model/entity/Review.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "Reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;
    @Column(name = "rating", nullable = false)
    private byte rating; // Dùng byte (hoặc tinyint) cho 1-5 sao
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    // --- Mối quan hệ ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}