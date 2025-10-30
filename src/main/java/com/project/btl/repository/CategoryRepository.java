// File: com/project/btl/repository/CategoryRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
// SỬA: Đổi JpaRepository<Category, Long> thành JpaRepository<Category, Integer>
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}