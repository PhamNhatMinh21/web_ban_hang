// File: com/project/btl/service/impl/UserServiceImpl.java
package com.project.btl.service.impl;

import com.project.btl.dto.request.UpdateUserRequest;
import com.project.btl.dto.response.UserResponse;
import com.project.btl.exception.ResourceNotFoundException;
import com.project.btl.model.entity.User;
import com.project.btl.repository.UserRepository;
import com.project.btl.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse updateUser(Integer userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user id: " + userId));

        // Cập nhật từng trường nếu có gửi lên
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());

        // Nếu cho phép đổi email (cần cẩn thận check trùng lặp nếu cần)
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public UserResponse getUserProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user id: " + userId));
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber()) // Trả về SĐT mới nhất
                .role(user.getRole().getRoleName())
                .build();
    }
}