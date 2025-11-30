// File: com/project/btl/repository/ProductVariantRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    Optional<ProductVariant> findBySku(String sku);
}