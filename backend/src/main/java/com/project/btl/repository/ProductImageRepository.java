// File: com.project/btl/repository/ProductImageRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
// Thêm các hàm tìm kiếm (ví dụ: theo product) nếu cần
}