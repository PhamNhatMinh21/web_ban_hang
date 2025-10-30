// File: com/project/btl/BtlApplication.java
//File này chạy được
package com.project.btl;
import com.project.btl.model.entity.Role; // BỔ SUNG import
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
    // --- SỬA LẠI BEAN NÀY ---
// Bean này sẽ chạy khi ứng dụng khởi động
// Nó kiểm tra và thêm 2 role USER và ADMIN vào DB
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            try {
// SỬA: Dùng findByRoleName (khớp với Repository)
// SỬA: Dùng chuỗi "USER" và "ADMIN" (khớp với AuthService)
                if (roleRepository.findByRoleName("USER").isEmpty()) {
                    Role userRole = new Role();
                    userRole.setRoleName("USER"); // Sửa
                    roleRepository.save(userRole);
                    System.out.println("--- Created ROLE_USER ---");
                }
                if (roleRepository.findByRoleName("ADMIN").isEmpty()) {
                    Role adminRole = new Role();
                    adminRole.setRoleName("ADMIN"); // Sửa
                    roleRepository.save(adminRole);
                    System.out.println("--- Created ROLE_ADMIN ---");
                }
            } catch (Exception e) {
                System.err.println("Error initializing roles: " + e.getMessage());
            }
        };
    }
}