// File: com/project/btl/model/entity/ProductImage.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "ProductImages")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    @Column(name = "is_thumbnail")
    private boolean isThumbnail;
    @Column(name = "sort_order")
    private int sortOrder;
    // --- Mối quan hệ ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}