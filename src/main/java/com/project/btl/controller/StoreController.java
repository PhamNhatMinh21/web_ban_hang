package com.project.btl.controller;

import com.project.btl.payload.response.StoreInfoResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/stores")
public class StoreController {

    // AI CŨNG CÓ THỂ XEM
    @GetMapping
    public List<StoreInfoResponse> getStores() {
        // Trả về danh sách bịa (hard-code)
        return List.of(
                new StoreInfoResponse(1, "GymStore Quận 1", "123 Nguyễn Huệ, P. Bến Nghé, Q.1, TPHCM", "0901234567"),
                new StoreInfoResponse(2, "GymStore Cầu Giấy", "456 Xuân Thủy, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội", "0908889999"),
                new StoreInfoResponse(3, "GymStore Hải Châu", "789 Bạch Đằng, P. Bình Hiên, Q. Hải Châu, Đà Nẵng", "0905556677")
        );
    }
}