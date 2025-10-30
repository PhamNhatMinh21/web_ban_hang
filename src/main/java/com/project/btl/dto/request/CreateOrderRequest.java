package com.project.btl.dto.request;
import com.project.btl.model.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
@Data
public class CreateOrderRequest {
    // Thông tin người dùng (cho guest checkout)
    @NotBlank(message = "Họ tên không được để trống")
    private String shippingFullName;
    @NotBlank(message = "Số điện thoại không được để trống")
    private String shippingPhoneNumber;
    // Địa chỉ giao hàng
    @NotBlank(message = "Địa chỉ không được để trống")
    private String shippingStreet;
    @NotBlank(message = "Phường/Xã không được để trống")
    private String shippingWard;
    @NotBlank(message = "Quận/Huyện không được để trống")
    private String shippingDistrict;
    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String shippingCity;
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;
    private String couponCode; // Có thể null
    @Valid
    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    private List<OrderItemRequest> items;
}