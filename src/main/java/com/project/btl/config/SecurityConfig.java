// File: com/project/btl/config/SecurityConfig.java
package com.project.btl.config;

import com.project.btl.service.impl.UserAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Cho phép dùng @PreAuthorize (phân quyền theo role)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserAuthService userAuthService;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF vì dùng API (stateless)
                .authorizeHttpRequests(auth -> auth
                        // === API công khai (Không cần token) ===
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        // BỔ SUNG: API public cho Banner
                        .requestMatchers(HttpMethod.GET, "/api/v1/banners/active").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/cart/active").permitAll()
                        // === API cần xác thực (Phải có token) ===
                        .requestMatchers("/api/v1/orders/**").authenticated()

                        // === API cần quyền ADMIN ===
                        // SỬA: Thêm tiền tố "ROLE_" để khớp với getAuthorities() trong User.java
                        .requestMatchers(HttpMethod.POST, "/api/v1/products").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAuthority("ROLE_ADMIN")
                        // BỔ SUNG: API admin cho Banner
                        .requestMatchers("/api/v1/banners/admin/**").hasAuthority("ROLE_ADMIN")

                        .anyRequest().authenticated() // Tất cả các API còn lại đều cần xác thực
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không dùng session
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Thêm filter JWT
        return http.build();
    }

    // Định nghĩa Bean mã hóa mật khẩu
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Định nghĩa Bean cung cấp cách xác thực
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userAuthService); // Dùng service tải user
        authProvider.setPasswordEncoder(passwordEncoder()); // Dùng bean mã hóa
        return authProvider;
    }

    // Bean này dùng trong lúc Login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}