package com.project.btl.service.impl;
import com.project.btl.dto.request.LoginRequest;
import com.project.btl.dto.request.RegisterRequest;
import com.project.btl.dto.response.AuthResponse;
import com.project.btl.dto.response.UserResponse;
import com.project.btl.exception.ResourceNotFoundException;
import com.project.btl.model.entity.Role;
import com.project.btl.model.entity.User;
import com.project.btl.repository.RoleRepository;
import com.project.btl.repository.UserRepository;
import com.project.btl.service.AuthService;
import com.project.btl.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    @Override
    public AuthResponse register(RegisterRequest request) {
// 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được đăng ký");
        }
// 2. Tìm role "USER"
// (QUAN TRỌNG: Bạn phải tự thêm Role "USER" và "ADMIN" vào DB trước)
        Role userRole = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role 'USER' không tồn tại. Vui lòng thêm vào DB."));
// 3. Tạo User mới và mã hóa mật khẩu
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        User savedUser = userRepository.save(user);
// 4. Tạo JWT token
        String jwtToken = jwtService.generateToken(user);
// 5. Tạo response
        UserResponse userResponse = mapUserToResponse(savedUser);
        return AuthResponse.builder().token(jwtToken).user(userResponse).build();
    }
    @Override
    public AuthResponse login(LoginRequest request) {
// 1. Xác thực người dùng (email, password)
// (Nếu sai, Spring Security sẽ tự ném lỗi)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
// 2. Nếu xác thực thành công, tìm lại user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Lỗi: Không tìm thấy user sau khi xác thực"));
// 3. Tạo token
        String jwtToken = jwtService.generateToken(user);
// 4. Tạo response
        UserResponse userResponse = mapUserToResponse(user);
        return AuthResponse.builder().token(jwtToken).user(userResponse).build();
    }
    // Helper
    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().getRoleName())
                .build();
    }
}