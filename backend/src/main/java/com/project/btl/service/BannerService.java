// File: com/project/btl/service/BannerService.java
package com.project.btl.service;
import com.project.btl.dto.response.BannerResponse;
import java.util.List;
public interface BannerService {
    // Lấy các banner public (đang active)
    List<BannerResponse> getActiveBanners();
// (Sau này tự thêm các hàm CRUD cho Admin nếu cần)
// List<BannerResponse> getAllBannersForAdmin();
// BannerResponse createBanner(CreateBannerRequest request);
// ...
}