// File: com/project/btl/dto/response/OrderResponse.java
package com.project.btl.dto.response;
import com.project.btl.model.enums.OrderStatus;
import com.project.btl.model.enums.PaymentMethod;
import com.project.btl.model.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
public class OrderResponse {
    private Integer orderId;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String shippingFullName;
    private String shippingAddress; // Ghép 4 trường địa chỉ lại
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<OrderDetailResponse> orderDetails;
    private String shippingPhoneNumber;
    private String email;
}