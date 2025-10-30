// File: com/project/btl/model/entity/User.java
package com.project.btl.model.entity;
// --- Imports cho JPA (Entity, Column, Relationships) ---
import jakarta.persistence.*;
// --- Imports cho Lombok (@Getter, @Setter) ---
import lombok.Getter;
import lombok.Setter;
// --- Imports cho Spring Security (UserDetails) ---
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
// --- Imports cho Java Utilities (List, Set, Collection, Time) ---
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Getter
@Setter
@Entity
@Table(name = "Users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // --- Mối quan hệ ---
// Cần EAGER để Security lấy được Role và Permissions
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;
    @OneToMany(mappedBy = "user")
    private Set<Order> orders;
    @OneToMany(mappedBy = "user")
    private Set<Review> reviews;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Address> addresses;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Cart cart;
    @OneToMany(mappedBy = "customer")
    private Set<ChatConversation> chatConversations;
    @OneToMany(mappedBy = "admin")
    private Set<ChatConversation> assignedConversations;
    @OneToMany(mappedBy = "sender")
    private Set<ChatMessage> chatMessages;
// --- Triển khai các phương thức của UserDetails ---
    /**
     * Trả về danh sách Quyền (Permissions) của User
     * (Đây là logic phân quyền theo Permission, không phải theo Role)
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
// Lấy danh sách permissions từ Role
        Set<Permission> permissions = this.role.getPermissions();
// Chuyển đổi Set<Permission> thành List<SimpleGrantedAuthority>
        List<SimpleGrantedAuthority> authorities = permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermissionName()))
                .collect(Collectors.toList());
// Thêm cả Role vào (ví dụ: "ROLE_ADMIN", "ROLE_USER")
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.role.getRoleName()));
        return authorities;
    }
    @Override
    public String getPassword() {
        return this.passwordHash; // Trả về cột mật khẩu đã mã hóa
    }
    @Override
    public String getUsername() {
        return this.email; // Dùng email làm username
    }
    // Các phương thức này để kiểm tra tài khoản (tạm thời để true)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
    // --- Tự động cập nhật thời gian ---
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