package com.project.btl.security;

// BỎ QUA CÁC IMPORT LIÊN QUAN ĐẾN AUTHENTICATION
// import com.project.btl.security.jwt.AuthEntryPointJwt;
// import com.project.btl.security.jwt.AuthTokenFilter;
// import com.project.btl.security.services.UserDetailsServiceImpl;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Vẫn giữ để @PreAuthorize hoạt động (nếu cần)
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

// Thêm các import cho CORS
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableMethodSecurity // Giữ lại để @PreAuthorize hoạt động (nếu bạn muốn giữ lại phân quyền Admin)
public class WebSecurityConfig {

    // --- BỎ HẾT CÁC BEAN LIÊN QUAN ĐẾN AUTHENTICATION ---
    // @Autowired UserDetailsServiceImpl userDetailsService;
    // @Autowired private AuthEntryPointJwt unauthorizedHandler;
    // @Bean public AuthTokenFilter authenticationJwtTokenFilter() { ... }
    // @Bean public DaoAuthenticationProvider authenticationProvider() { ... }
    // @Bean public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) { ... }
    // @Bean public PasswordEncoder passwordEncoder() { ... }

    // --- GIỮ LẠI BEAN CẤU HÌNH CORS ---
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5500", "http://localhost:5500"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    // --- KẾT THÚC BEAN CORS ---

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                // --- BỎ exceptionHandling VÀ sessionManagement ---
                // .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                // .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth
                                // --- CHO PHÉP TẤT CẢ MỌI REQUEST ---
                                .anyRequest().permitAll() // Cho phép tất cả
                );

        // --- BỎ addFilterBefore VÀ authenticationProvider ---
        // http.authenticationProvider(authenticationProvider());
        // http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

