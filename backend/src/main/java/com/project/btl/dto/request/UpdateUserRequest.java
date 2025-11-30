// File: com/project/btl/dto/request/UpdateUserRequest.java
package com.project.btl.dto.request;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber; // Hứng số điện thoại mới
    private String email;       // Hứng email mới (nếu cho phép đổi)
}