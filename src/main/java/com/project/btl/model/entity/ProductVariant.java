// File: com/project/btl/model/entity/ProductVariant.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "ProductVariants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Integer variantId;
    @Column(name = "name")
    private String name;
    @Column(name = "sku", unique = true)
    private String sku;
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;
    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;
    @Column(name = "sale_start_date")
    private LocalDateTime saleStartDate;
    @Column(name = "sale_end_date")
    private LocalDateTime saleEndDate;
    @Column(name = "stock_quantity")
    private int stockQuantity;
    // --- Mối quan hệ ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}