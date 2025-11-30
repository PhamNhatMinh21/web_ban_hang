// File: com/project/btl/repository/CartRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Cart;
import com.project.btl.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUser_UserId(Integer userId);
}