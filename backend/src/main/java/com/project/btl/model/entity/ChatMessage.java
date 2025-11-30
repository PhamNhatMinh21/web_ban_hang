// File: com/project/btl/model/entity/ChatMessage.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "ChatMessages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;
    // --- Mối quan hệ ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private ChatConversation conversation;
    // "sender" là tên biến trong User.java (mappedBy = "sender")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false) // ID người gửi (User/Admin)
    private User sender;
    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }
}