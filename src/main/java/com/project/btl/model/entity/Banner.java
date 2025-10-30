// File: com/project/btl/model/entity/Banner.java
package com.project.btl.model.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "Banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Integer bannerId;
    @Column(name = "title")
    private String title;
    @Column(name = "image_url_desktop", nullable = false)
    private String imageUrlDesktop;
    @Column(name = "image_url_mobile")
    private String imageUrlMobile;
    @Column(name = "target_link")
    private String targetLink; // Đường link khi click vào banner
    @Column(name = "is_active", columnDefinition = "boolean default true")
    private boolean isActive = true;
    @Column(name = "sort_order", columnDefinition = "int default 0")
    private int sortOrder = 0; // Thứ tự ưu tiên
}