// File: com/project/btl/controller/UserController.java
package com.project.btl.controller;

import com.project.btl.dto.request.UpdateUserRequest;
import com.project.btl.dto.response.UserResponse;
import com.project.btl.model.entity.User;
import com.project.btl.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // API Cập nhật thông tin: PUT http://localhost:8080/api/v1/users/profile
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User currentUser, // Lấy user đang đăng nhập
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(currentUser.getUserId(), request));
    }

    // API Lấy thông tin mới nhất: GET http://localhost:8080/api/v1/users/profile
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getUserProfile(currentUser.getUserId()));
    }
}