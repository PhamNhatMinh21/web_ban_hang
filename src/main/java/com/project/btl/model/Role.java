package com.project.btl.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor // Lombok: Tự tạo constructor rỗng
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING) // Lưu tên Role (USER, ADMIN)
    @Column(length = 20)
    private ERole name;

    public Role(ERole name) {
        this.name = name;
    }
}