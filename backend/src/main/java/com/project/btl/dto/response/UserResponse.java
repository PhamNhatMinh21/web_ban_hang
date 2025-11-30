// File: com/project/btl/dto/response/UserResponse.java
// DTO này để trả về thông tin user an toàn (không có mật khẩu)
package com.project.btl.dto.response;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class UserResponse {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String role; // Chỉ trả về tên Role
}