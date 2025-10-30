package com.project.btl.controller;
import com.project.btl.dto.request.CreateOrderRequest;
import com.project.btl.dto.response.OrderResponse;
import com.project.btl.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    /**
     * API để tạo đơn hàng mới (Checkout)
     * Frontend gọi: POST http://localhost:8080/api/v1/orders
     * Body: { ... (CreateOrderRequest) }
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse newOrder = orderService.createOrder(request);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }
    /**
     * API để xem chi tiết đơn hàng
     * Frontend gọi: GET http://localhost:8080/api/v1/orders/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    /**
     * API để hủy đơn hàng
     * Frontend gọi: PUT http://localhost:8080/api/v1/orders/1/cancel
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Integer id) {
        OrderResponse cancelledOrder = orderService.cancelOrder(id);
        return ResponseEntity.ok(cancelledOrder);
    }
// (Sau này sẽ thêm API lấy lịch sử đơn hàng của User)
// @GetMapping("/my-orders")
// public ResponseEntity<List<OrderResponse>> getMyOrders() { ... }
}