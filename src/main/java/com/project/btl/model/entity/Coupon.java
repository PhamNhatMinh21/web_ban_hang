// File: com/project/btl/model/entity/Coupon.java
package com.project.btl.model.entity;
import com.project.btl.model.enums.DiscountType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "Coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Integer couponId;
    @Column(name = "code", unique = true, nullable = false)
    private String code;
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal minOrderValue;
    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;
    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;
    @Column(name = "usage_limit", nullable = false)
    private int usageLimit; // Giới hạn số lần dùng
    // THÊM TRƯỜNG NÀY (Không có trong ERD nhưng bắt buộc phải có)
    @Column(name = "usage_count", nullable = false, columnDefinition = "int default 0")
    private int usageCount = 0; // Số lần đã dùng
}