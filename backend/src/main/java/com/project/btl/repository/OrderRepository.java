// File: com/project/btl/repository/OrderRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Order;
import com.project.btl.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Tìm các đơn hàng của một user cụ thể
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.orderDetails od " + // LEFT JOIN phòng trường hợp đơn không có sản phẩm
            "LEFT JOIN FETCH od.variant v " +      // Ép JOIN và tải variant
            "LEFT JOIN FETCH v.product p " +       // Ép JOIN và tải product
            "ORDER BY o.createdAt DESC")
    List<Order> findAllWithDetails();

    // Bạn cũng có thể cần một hàm tương tự cho tìm theo ID
    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.orderDetails od " +
            "LEFT JOIN FETCH od.variant v " +
            "LEFT JOIN FETCH v.product p " +
            "WHERE o.orderId = :orderId")
    Optional<Order> findByIdWithDetails(Integer orderId);
}