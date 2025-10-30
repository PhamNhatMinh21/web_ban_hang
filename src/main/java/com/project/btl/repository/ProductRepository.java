// File: com/project/btl/repository/ProductRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
// Bạn có thể thêm các phương thức tìm kiếm tùy chỉnh ở đây
// Ví dụ: List<Product> findByCategory(Category category);
}