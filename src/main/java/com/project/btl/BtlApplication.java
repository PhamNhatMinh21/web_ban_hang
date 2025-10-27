package com.project.btl;

import com.project.btl.model.ERole;
import com.project.btl.model.Role;
import com.project.btl.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BtlApplication {

    public static void main(String[] args) {
        SpringApplication.run(BtlApplication.class, args);
    }

    // --- BƯỚC 2 LÀ THÊM BEAN NÀY ---
    // Bean này sẽ chạy khi ứng dụng khởi động
    // Nó kiểm tra và thêm 2 role USER và ADMIN vào DB (vì DB đã bị 'create-drop')
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            try {
                // Chỉ thêm nếu Bảng Roles đang trống
                if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
                    roleRepository.save(new Role(ERole.ROLE_USER));
                    System.out.println("--- Created ROLE_USER ---");
                }
                if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                    roleRepository.save(new Role(ERole.ROLE_ADMIN));
                    System.out.println("--- Created ROLE_ADMIN ---");
                }
            } catch (Exception e) {
                System.err.println("Error initializing roles: " + e.getMessage());
            }
        };
    }
    // --- KẾT THÚC BEAN INIT ROLES ---
}

