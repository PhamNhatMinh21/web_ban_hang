// File: com/project/btl/dto/response/AuthResponse.java
// DTO trả về cho frontend sau khi đăng nhập/đăng ký thành công
package com.project.btl.dto.response;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class AuthResponse {
    private String token; // Mã JWT
    private UserResponse user; // Thông tin user
}