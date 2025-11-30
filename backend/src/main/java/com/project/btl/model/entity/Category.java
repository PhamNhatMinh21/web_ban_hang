// File: com/project/btl/model/entity/Category.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;
@Getter
@Setter
@Entity
@Table(name = "Categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;
    @Column(name = "name")
    private String name;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // --- Mối quan hệ tự tham chiếu ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id") // FK trỏ về chính nó
    private Category parent;
    @OneToMany(mappedBy = "parent") // Danh sách các danh mục con
    private Set<Category> children;
    @OneToMany(mappedBy = "category")
    private Set<Product> products;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}