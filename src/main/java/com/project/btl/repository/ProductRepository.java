package com.project.btl.repository;

import com.project.btl.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Tự động tạo câu lệnh SQL: SELECT * FROM products WHERE name LIKE '%:name%'
    List<Product> findByNameContaining(String name);
}