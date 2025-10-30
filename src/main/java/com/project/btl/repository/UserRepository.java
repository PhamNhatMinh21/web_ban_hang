// File: com/project/btl/repository/UserRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Spring Data JPA sẽ tự hiểu và tạo câu query: "SELECT * FROM Users WHERE email = ?"
    Optional<User> findByEmail(String email);
}