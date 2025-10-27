package com.project.btl.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter // Lombok: Tự tạo các hàm get...()
@Setter // Lombok: Tự tạo các hàm set...()
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private double price;

    @Lob // Dùng cho text dài
    private String description;

    // Quan hệ với Category
    @ManyToOne
    @JoinColumn(name = "category_id") // Tên cột khóa ngoại trong bảng 'products'
    private Category category;
}