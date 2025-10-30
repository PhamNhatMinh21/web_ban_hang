// File: com/project/btl/service/OrderService.java
package com.project.btl.service;
import com.project.btl.dto.request.CreateOrderRequest;
import com.project.btl.dto.response.OrderResponse;
import java.util.List;
public interface OrderService {
    /**
     * Tạo một đơn hàng mới.
     * Tạm thời chúng ta chưa xử lý user ID (sẽ thêm sau khi có Auth)
     */
    OrderResponse createOrder(CreateOrderRequest request);
    /**
     * Lấy chi tiết đơn hàng theo ID.
     */
    OrderResponse getOrderById(Integer orderId);
/**
 * Lấy lịch sử đơn hàng của một User (sẽ dùng sau khi có Auth)
 */
// List<OrderResponse> getOrdersByUserId(Integer userId);
    /**
     * Hủy một đơn hàng
     */
    OrderResponse cancelOrder(Integer orderId);
}