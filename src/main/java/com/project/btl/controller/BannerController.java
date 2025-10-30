package com.project.btl.controller;
import com.project.btl.dto.response.BannerResponse;
import com.project.btl.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;
    /**
     * API Public để lấy các banner đang hiển thị (đã thêm vào SecurityConfig)
     * Frontend gọi: GET http://localhost:8080/api/v1/banners/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<BannerResponse>> getActiveBanners() {
        List<BannerResponse> banners = bannerService.getActiveBanners();
        return ResponseEntity.ok(banners);
    }
// (Bạn có thể thêm các API Admin tại /admin/** sau)
// @GetMapping("/admin/all")
// @PreAuthorize("hasAuthority('ROLE_ADMIN')")
// ...
}