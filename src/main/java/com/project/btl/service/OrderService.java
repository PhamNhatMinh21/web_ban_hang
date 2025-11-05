// File: com/project/btl/service/OrderService.java
package com.project.btl.service;
import com.project.btl.dto.request.CreateOrderRequest;
import com.project.btl.dto.response.OrderResponse;
import com.project.btl.model.enums.OrderStatus;

import java.util.List;
public interface OrderService {
    /**
     * Tạo một đơn hàng mới.
     */
    OrderResponse createOrder(CreateOrderRequest request);
    /**
     * Lấy chi tiết đơn hàng theo ID.
     */
    OrderResponse getOrderById(Integer orderId);
    /**
     * Hủy một đơn hàng
     */
    OrderResponse cancelOrder(Integer orderId);

    // Các hàm của Admin/User
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByUserId(Integer userId);

    // Hàm cập nhật trạng thái Admin
    OrderResponse updateOrderStatus(Integer orderId, com.project.btl.model.enums.OrderStatus newStatus);
}