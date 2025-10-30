// File: com/project/btl/repository/ChatConversationRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Integer> {
// Thêm các hàm tìm kiếm (ví dụ: theo user, theo admin) nếu cần
}