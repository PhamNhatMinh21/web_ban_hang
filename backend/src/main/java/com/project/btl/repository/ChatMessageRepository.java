// File: com.project/btl/repository/ChatMessageRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
// Thêm các hàm tìm kiếm (ví dụ: theo conversation) nếu cần
}