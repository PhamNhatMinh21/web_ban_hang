package com.project.btl.controller;
import com.project.btl.dto.request.LoginRequest;
import com.project.btl.dto.request.RegisterRequest;
import com.project.btl.dto.response.AuthResponse;
import com.project.btl.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    /**
     * API để đăng ký tài khoản mới
     * Frontend gọi: POST http://localhost:8080/api/v1/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
// Trả về 200 OK + Token
        return ResponseEntity.ok(authService.register(request));
    }
    /**
     * API để đăng nhập
     * Frontend gọi: POST http://localhost:8080/api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
// Trả về 200 OK + Token
        return ResponseEntity.ok(authService.login(request));
    }
}