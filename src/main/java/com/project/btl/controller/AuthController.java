package com.project.btl.controller;

import com.project.btl.model.ERole;
import com.project.btl.model.Role;
import com.project.btl.model.User;
import com.project.btl.payload.request.LoginRequest;
import com.project.btl.payload.request.SignupRequest;
import com.project.btl.payload.response.JwtResponse;
import com.project.btl.payload.response.MessageResponse;
import com.project.btl.repository.RoleRepository;
import com.project.btl.repository.UserRepository;
import com.project.btl.security.jwt.JwtUtils;
import com.project.btl.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// Import thêm Optional
import java.util.Optional;
// Import thêm UserDetails (để build thủ công)
import org.springframework.security.core.userdetails.UserDetails;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // --- SỬA LỖI TIÊM DEPENDENCY ---
    // Chúng ta dùng constructor injection cho an toàn

    final AuthenticationManager authenticationManager;
    final UserRepository userRepository;
    final RoleRepository roleRepository;
    final PasswordEncoder encoder;
    final JwtUtils jwtUtils;

    // Spring sẽ tự động tiêm các Bean này vào constructor
    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder encoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    // --- LOGIC HACK (BỎ QUA KIỂM TRA MẬT KHẨU) ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Bước 1: Chỉ tìm user bằng Tên đăng nhập
        Optional<User> userData = userRepository.findByUsername(loginRequest.getUsername());

        // Bước 2: Nếu không tìm thấy User, báo lỗi 401
        if (userData.isEmpty()) {
            // Trả về lỗi 401 (Unauthorized)
            return ResponseEntity.status(401).body(new MessageResponse("Error: User '" + loginRequest.getUsername() + "' not found!"));
        }

        // Bước 3: Nếu TÌM THẤY USER -> BỎ QUA KIỂM TRA MẬT KHẨU
        // Lấy user ra
        User user = userData.get();

        // Bước 4: Tạo token ngay lập tức

        // Tạo UserDetails (Spring Security cần cái này)
        UserDetails userDetails = UserDetailsImpl.build(user);

        // Tạo Authentication (giả)
        // Chúng ta tạo một đối tượng xác thực thủ công và đặt nó vào context
        Authentication authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        // Đưa user vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo JWT token từ đối tượng authentication (giả)
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Lấy thông tin user
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetailsImpl.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Bước 5: Trả về token (Đăng nhập thành công)
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetailsImpl.getId(),
                userDetailsImpl.getUsername(),
                userDetailsImpl.getEmail(),
                roles));
    }
    // --- KẾT THÚC LOGIC HACK ---


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), // Vẫn mã hóa mật khẩu khi đăng ký
                signUpRequest.getFullName(),
                signUpRequest.getAddress());

        Set<String> strRoles = signUpRequest.getRole(); // Dòng này bị bỏ qua do logic bên dưới
        Set<Role> roles = new HashSet<>();

        // --- LOGIC GÁN QUYỀN TỰ ĐỘNG ---
        // Bỏ qua mọi thứ frontend gửi lên, tự check email

        if (signUpRequest.getEmail() != null && signUpRequest.getEmail().endsWith("@gymstore.admin")) {
            // Nếu email có đuôi @gymstore.admin -> Gán ADMIN
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found. (DB CHƯA CÓ?)"));
            roles.add(adminRole);
        } else {
            // Mặc định là USER
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role USER is not found. (DB CHƯA CÓ?)"));
            roles.add(userRole);
        }
        // --- KẾT THÚC LOGIC GÁN QUYỀN ---

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}

