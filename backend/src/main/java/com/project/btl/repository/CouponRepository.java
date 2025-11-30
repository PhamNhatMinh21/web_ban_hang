// File: com/project/btl/repository/CouponRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    // Tìm coupon bằng mã
    Optional<Coupon> findByCode(String code);
}