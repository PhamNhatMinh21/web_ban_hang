// File: com/project/btl/service/UserService.java
package com.project.btl.service;
import com.project.btl.dto.request.UpdateUserRequest;
import com.project.btl.dto.response.UserResponse;

public interface UserService {
    // Hàm cập nhật thông tin
    UserResponse updateUser(Integer userId, UpdateUserRequest request);

    // Hàm lấy thông tin profile (để đảm bảo dữ liệu mới nhất)
    UserResponse getUserProfile(Integer userId);
}