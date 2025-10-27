// File: com/project/btl/BtlApplication.java
package com.project.btl;

import com.project.btl.model.entity.Role; // Sửa import
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
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            try {
                // 1. Dùng findByRoleName (giống như trong Repository)
                // 2. Dùng chuỗi "USER" và "ADMIN" (giống như trong AuthService)
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