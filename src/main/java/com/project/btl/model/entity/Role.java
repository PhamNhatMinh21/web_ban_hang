// File: com/project/btl/model/entity/Role.java
package com.project.btl.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "roles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "role_name", unique = true, nullable = false)
    private String roleName;

    // Quan hệ 1-n với User (Mặc định LAZY, không cần sửa)
    @OneToMany(mappedBy = "role")
    private Set<User> users;

    // SỬA TẠI ĐÂY: Thêm 'fetch = FetchType.EAGER'
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "RolePermissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;
}