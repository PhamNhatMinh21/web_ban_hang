// File: com/project/btl/service/AuthService.java
package com.project.btl.service;
import com.project.btl.dto.request.LoginRequest;
import com.project.btl.dto.request.RegisterRequest;
import com.project.btl.dto.response.AuthResponse;
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}