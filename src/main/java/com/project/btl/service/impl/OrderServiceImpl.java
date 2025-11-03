// File: com/project/btl/service/impl/OrderService.java
package com.project.btl.service.impl;
// ... (Tất cả import giữ nguyên)
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    // ... (Các repository giữ nguyên)
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    private static final BigDecimal DEFAULT_SHIPPING_FEE = new BigDecimal("30000");

    // ... (Hàm createOrder, getOrderById, cancelOrder giữ nguyên) ...
    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
// ... (code giữ nguyên)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Người dùng chưa đăng nhập hoặc không hợp lệ.");
        }
        User authenticatedUser = (User) authentication.getPrincipal();
        Order order = new Order();
        order.setUser(authenticatedUser);
// ... (code giữ nguyên)
        order.setShippingFullName(request.getShippingFullName());
        order.setShippingPhoneNumber(request.getShippingPhoneNumber());
        order.setShippingStreet(request.getShippingStreet());
        order.setShippingWard(request.getShippingWard());
        order.setShippingDistrict(request.getShippingDistrict());
        order.setShippingCity(request.getShippingCity());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING_CONFIRMATION);
        order.setPaymentStatus(PaymentStatus.PENDING);
        BigDecimal subtotal = BigDecimal.ZERO;
        Set<OrderDetail> orderDetails = new HashSet<>();
        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm ID: " + itemRequest.getVariantId()));
            if (variant.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Sản phẩm " + variant.getName() + " không đủ tồn kho.");
            }
            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setVariant(variant);
            detail.setQuantity(itemRequest.getQuantity());
            BigDecimal priceAtPurchase = (variant.getSalePrice() != null &&
                    variant.getSalePrice().compareTo(BigDecimal.ZERO) > 0)
                    ? variant.getSalePrice() : variant.getPrice();
            detail.setPriceAtPurchase(priceAtPurchase);
            subtotal = subtotal.add(priceAtPurchase.multiply(new BigDecimal(itemRequest.getQuantity())));
            orderDetails.add(detail);
        }
        BigDecimal discountAmount = BigDecimal.ZERO;
        order.setSubtotal(subtotal);
        order.setShippingFee(DEFAULT_SHIPPING_FEE);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(subtotal.add(DEFAULT_SHIPPING_FEE).subtract(discountAmount));
        order.setOrderDetails(orderDetails);
        Order savedOrder = orderRepository.save(order);
        productVariantRepository.saveAll(orderDetails.stream().map(OrderDetail::getVariant).collect(Collectors.toList()));
        return convertToOrderResponse(savedOrder);
    }
    @Override
    public OrderResponse getOrderById(Integer orderId) {
// ... (code giữ nguyên)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Người dùng chưa đăng nhập hoặc không hợp lệ.");
        }
        User authenticatedUser = (User) authentication.getPrincipal();
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
// ... (code giữ nguyên)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Người dùng chưa đăng nhập hoặc không hợp lệ.");
        }
        User authenticatedUser = (User) authentication.getPrincipal();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));
        if (!authenticatedUser.getRole().getRoleName().equals("ADMIN") &&
                !order.getUser().getUserId().equals(authenticatedUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền hủy đơn hàng này");
        }
        if (order.getStatus() != OrderStatus.PENDING_CONFIRMATION) {
            throw new IllegalArgumentException("Không thể hủy đơn hàng đang ở trạng thái: " + order.getStatus());
        }
        order.setStatus(OrderStatus.CANCELLED);
        for (OrderDetail detail : order.getOrderDetails()) {
            ProductVariant variant = detail.getVariant();
            variant.setStockQuantity(variant.getStockQuantity() + detail.getQuantity());
            productVariantRepository.save(variant);
        }
        Order cancelledOrder = orderRepository.save(order);
        return convertToOrderResponse(cancelledOrder);
    }

    // === THÊM 2 HÀM MỚI ===

    @Override
    public List<OrderResponse> getAllOrders() {
        // (Chúng ta sẽ thêm kiểm tra ADMIN ở Controller)
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    // === HẾT THÊM MỚI ===


    private OrderResponse convertToOrderResponse(Order order) {
        // ... (code giữ nguyên)
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
