package com.project.btl.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = { // Ràng buộc duy nhất
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@Getter
@Setter
@NoArgsConstructor // Lombok: Tự tạo constructor rỗng
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password; // Mật khẩu đã được mã hóa

    private String fullName;
    private String address;

    @ManyToMany(fetch = FetchType.EAGER) // Load Role ngay khi load User
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // Constructor này dùng khi tạo user mới
    public User(String username, String email, String password, String fullName, String address) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.address = address;
    }
}