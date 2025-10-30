// File: com/project/btl/model/entity/Permission.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;
@Getter
@Setter
@Entity
@Table(name = "Permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Integer permissionId;
    @Column(name = "permission_name", nullable = false)
    private String permissionName;
    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;
}