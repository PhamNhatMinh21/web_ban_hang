// File: com/project/btl/model/entity/ChatConversation.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;
@Getter
@Setter
@Entity
@Table(name = "ChatConversations")
public class ChatConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Integer conversation_id;
    @Column(name = "session_id")
    private String sessionId;
    @Column(name = "status")
    private String status; // Bạn có thể dùng Enum ở đây
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // --- Mối quan hệ ---
// "customer" là tên biến trong User.java (mappedBy = "customer")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // ID của khách hàng
    private User customer;
    // "admin" là tên biến trong User.java (mappedBy = "admin")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id") // ID của admin/agent
    private User admin;
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private Set<ChatMessage> messages;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}