package com.project.btl.service.impl;
// 1. ĐẢM BẢO BẠN ĐÃ IMPORT ĐẦY ĐỦ
import com.project.btl.dto.request.CreateOrderRequest;
import com.project.btl.dto.request.OrderItemRequest;
import com.project.btl.dto.response.OrderDetailResponse;
import com.project.btl.dto.response.OrderResponse;
import com.project.btl.exception.ResourceNotFoundException;
import com.project.btl.model.entity.*;
import com.project.btl.model.enums.OrderStatus;
import com.project.btl.model.enums.PaymentStatus;
import com.project.btl.repository.CouponRepository;
import com.project.btl.repository.OrderRepository;
import com.project.btl.repository.ProductVariantRepository;
import com.project.btl.repository.UserRepository;
import com.project.btl.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException; // Đã có
import org.springframework.security.core.context.SecurityContextHolder; // Đã có
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication; // Bổ sung import

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    // 2. KHAI BÁO CÁC REPOSITORY ĐẦY ĐỦ
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    // Tạm thời hard-code phí ship
    private static final BigDecimal DEFAULT_SHIPPING_FEE = new BigDecimal("30000");
    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
// 1. LẤY USER ĐÃ ĐĂNG NHẬP từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Người dùng chưa đăng nhập hoặc không hợp lệ.");
        }
        User authenticatedUser = (User) authentication.getPrincipal(); // Đã sửa lỗi ép kiểu
        Order order = new Order();
// 2. Gán user_id vào đơn hàng
        order.setUser(authenticatedUser);
// 3. Set thông tin giao hàng
        order.setShippingFullName(request.getShippingFullName());
        order.setShippingPhoneNumber(request.getShippingPhoneNumber());
        order.setShippingStreet(request.getShippingStreet());
        order.setShippingWard(request.getShippingWard());
        order.setShippingDistrict(request.getShippingDistrict());
        order.setShippingCity(request.getShippingCity());
// (Không cần guestEmail nữa)
        order.setPaymentMethod(request.getPaymentMethod());
// Các giá trị mặc định khi tạo đơn
        order.setStatus(OrderStatus.PENDING_CONFIRMATION);
        order.setPaymentStatus(PaymentStatus.PENDING);
        BigDecimal subtotal = BigDecimal.ZERO;
        Set<OrderDetail> orderDetails = new HashSet<>();
// 4. Xử lý các sản phẩm trong giỏ hàng
        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm ID: " + itemRequest.getVariantId()));
// 4a. Kiểm tra tồn kho
            if (variant.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Sản phẩm " + variant.getName() + " không đủ tồn kho.");
            }
// 4b. Trừ kho
            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
// 4c. Tạo OrderDetail
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setVariant(variant);
            detail.setQuantity(itemRequest.getQuantity());
            BigDecimal priceAtPurchase = (variant.getSalePrice() != null &&
                    variant.getSalePrice().compareTo(BigDecimal.ZERO) > 0)
                    ? variant.getSalePrice() : variant.getPrice();
            detail.setPriceAtPurchase(priceAtPurchase);
// 4d. Tính tổng phụ
            subtotal = subtotal.add(priceAtPurchase.multiply(new BigDecimal(itemRequest.getQuantity())));
            orderDetails.add(detail);
        }
// 5. Xử lý mã giảm giá (TODO)
        BigDecimal discountAmount = BigDecimal.ZERO;
// 6. Tính toán tổng tiền
        order.setSubtotal(subtotal);
        order.setShippingFee(DEFAULT_SHIPPING_FEE);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(subtotal.add(DEFAULT_SHIPPING_FEE).subtract(discountAmount));
// 7. Lưu đơn hàng
        order.setOrderDetails(orderDetails);
        Order savedOrder = orderRepository.save(order);
// Lưu lại số lượng tồn kho mới
        productVariantRepository.saveAll(orderDetails.stream().map(OrderDetail::getVariant).collect(Collectors.toList()));
// 8. Chuyển đổi sang DTO và trả về
        return convertToOrderResponse(savedOrder);
    }
    @Override
    public OrderResponse getOrderById(Integer orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Người dùng chưa đăng nhập hoặc không hợp lệ.");
        }
        User authenticatedUser = (User) authentication.getPrincipal(); // Đã sửa lỗi ép kiểu
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));
        if (!authenticatedUser.getRole().getRoleName().equals("ADMIN") &&
                !order.getUser().getUserId().equals(authenticatedUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền xem đơn hàng này");
        }
        return convertToOrderResponse(order);
    }
    @Override
    @Transactional
    public OrderResponse cancelOrder(Integer orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Người dùng chưa đăng nhập hoặc không hợp lệ.");
        }
        User authenticatedUser = (User) authentication.getPrincipal(); // Đã sửa lỗi ép kiểu
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));
// Kiểm tra quyền
        if (!authenticatedUser.getRole().getRoleName().equals("ADMIN") &&
                !order.getUser().getUserId().equals(authenticatedUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền hủy đơn hàng này");
        }
        if (order.getStatus() != OrderStatus.PENDING_CONFIRMATION) {
            throw new IllegalArgumentException("Không thể hủy đơn hàng đang ở trạng thái: " + order.getStatus());
        }
        order.setStatus(OrderStatus.CANCELLED);
// Hoàn lại kho
        for (OrderDetail detail : order.getOrderDetails()) {
            ProductVariant variant = detail.getVariant();
            variant.setStockQuantity(variant.getStockQuantity() + detail.getQuantity());
            productVariantRepository.save(variant);
        }
        Order cancelledOrder = orderRepository.save(order);
        return convertToOrderResponse(cancelledOrder);
    }
    // 3. PHƯƠNG THỨC HELPER ĐƯỢC THÊM VÀO
    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderDetailResponse> detailResponses = order.getOrderDetails().stream()
                .map(detail -> OrderDetailResponse.builder()
                        .variantId(detail.getVariant().getVariantId())
                        .productName(detail.getVariant().getProduct().getName())
                        .variantName(detail.getVariant().getName())
                        .quantity(detail.getQuantity())
                        .priceAtPurchase(detail.getPriceAtPurchase())
                        .build())
                .collect(Collectors.toList());
        String shippingAddress = String.join(", ",
                order.getShippingStreet(),
                order.getShippingWard(),
                order.getShippingDistrict(),
                order.getShippingCity());
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .shippingFullName(order.getShippingFullName())
                .shippingAddress(shippingAddress)
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .orderDetails(detailResponses)
                .build();
    }
}