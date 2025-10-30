// File: com/project/btl/repository/OrderRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Order;
import com.project.btl.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Tìm các đơn hàng của một user cụ thể
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}