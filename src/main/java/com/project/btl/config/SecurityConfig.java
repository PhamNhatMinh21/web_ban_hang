package com.project.btl.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.project.btl.service.impl.UserAuthService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // THÊM DÒNG NÀY (QUAN TRỌNG!)
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserAuthService userAuthService;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://gymsup.vercel.app/" , "https://gymsup1.vercel.app/" , "http://localhost:3001/" , "http://localhost:3000/"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    // 1. PUBLIC
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    
                    // --- QUAN TRỌNG: THÊM CÁI NÀY ĐỂ KHỚP VỚI FRONTEND CỦA BẠN ---
                
                    .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                    // -------------------------------------------------------------

                    .requestMatchers(HttpMethod.GET, "/api/v1/banners/active").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/reviews/**").permitAll()

                    // Cho phép method OPTIONS (để trình duyệt hỏi đường trước khi gửi request thật)
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                    // 2. ADMIN APIs
                    .requestMatchers(HttpMethod.POST, "/api/v1/products").hasAuthority("ROLE_ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAuthority("ROLE_ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAuthority("ROLE_ADMIN")
                    .requestMatchers("/api/v1/banners/admin/**").hasAuthority("ROLE_ADMIN")

                    // 3. USER APIs
                    .requestMatchers("/api/v1/orders/**").authenticated()
                    .requestMatchers("/api/v1/cart/**").authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/v1/reviews/**").authenticated()

                    // 4. MỌI THỨ CÒN LẠI
                    .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
    }

    // Các bean khác giữ nguyên
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userAuthService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}