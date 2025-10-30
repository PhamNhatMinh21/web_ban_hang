// File: com.project/btl/repository/ReviewRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
// Thêm các hàm tìm kiếm (ví dụ: theo product, theo user) nếu cần
}