// File: com/project/btl/repository/RoleRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface RoleRepository extends JpaRepository<Role, Integer> {
    // Spring Data JPA tự hiểu: "SELECT * FROM Roles WHERE role_name = ?"
    Optional<Role> findByRoleName(String roleName);
}