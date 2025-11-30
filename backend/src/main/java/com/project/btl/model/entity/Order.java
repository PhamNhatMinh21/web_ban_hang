// File: com/project/btl/model/entity/Order.java
package com.project.btl.model.entity;
import com.project.btl.model.enums.OrderStatus;
import com.project.btl.model.enums.PaymentMethod;
import com.project.btl.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
@Getter
@Setter
@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;
    @Column(name = "guest_email")
    private String guestEmail;
    // ... (Thêm tất cả các trường shipping_... )
    @Column(name = "shipping_full_name")
    private String shippingFullName;
    @Column(name = "shipping_phone_number")
    private String shippingPhoneNumber;
    @Column(name = "shipping_street")
    private String shippingStreet;
    @Column(name = "shipping_ward")
    private String shippingWard;
    @Column(name = "shipping_district")
    private String shippingDistrict;
    @Column(name = "shipping_city")
    private String shippingCity;
    // ...
    @Column(name = "subtotal", precision = 10, scale = 2)
    private BigDecimal subtotal;
    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee;
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;
    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING) // Lưu tên enum (ví dụ: "COD") vào DB
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // --- Mối quan hệ ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // Cho phép null
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id") // Cho phép null
    private Coupon coupon;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderDetail> orderDetails;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
        if (status == null) {
            status = OrderStatus.PENDING_CONFIRMATION;
        }
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}