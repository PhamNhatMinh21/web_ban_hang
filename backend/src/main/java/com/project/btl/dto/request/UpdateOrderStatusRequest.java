package com.project.btl.dto.request;

import com.project.btl.model.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus newStatus;
}
