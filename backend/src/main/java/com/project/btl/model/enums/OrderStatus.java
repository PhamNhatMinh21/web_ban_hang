// File: com/project/btl/model/enums/OrderStatus.java
package com.project.btl.model.enums;
public enum OrderStatus {
    PENDING_CONFIRMATION, // Chờ xác nhận
    PROCESSING, // Đang xử lý
    SHIPPING, // Đang giao hàng
    COMPLETED, // Hoàn thành
    CANCELLED, // Đã hủy
    RETURNED // Trả hàng
}