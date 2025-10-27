package com.project.btl.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Getter
@Setter
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob // Dùng cho nội dung text dài
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;

    @PrePersist // Tự động gán ngày giờ khi tạo mới
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}