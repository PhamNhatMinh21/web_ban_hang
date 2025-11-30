// File: com/project/btl/repository/BrandRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
}