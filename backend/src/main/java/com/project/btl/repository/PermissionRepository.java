// File: com.project/btl/repository/PermissionRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
// Optional<Permission> findByPermissionName(String name); // (Nếu cần)
}