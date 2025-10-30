// File: com/project/btl/repository/BannerRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
    // Tìm các banner đang hoạt động, sắp xếp theo thứ tự ưu tiên
    List<Banner> findByIsActiveTrueOrderBySortOrderAsc();
}