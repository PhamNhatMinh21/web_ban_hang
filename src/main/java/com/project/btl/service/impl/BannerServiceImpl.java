package com.project.btl.service.impl;
import com.project.btl.dto.response.BannerResponse;
import com.project.btl.model.entity.Banner;
import com.project.btl.repository.BannerRepository;
import com.project.btl.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {
    private final BannerRepository bannerRepository;
    @Override
    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderBySortOrderAsc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    private BannerResponse convertToResponse(Banner banner) {
        return BannerResponse.builder()
                .bannerId(banner.getBannerId())
                .title(banner.getTitle())
                .imageUrlDesktop(banner.getImageUrlDesktop())
                .imageUrlMobile(banner.getImageUrlMobile())
                .targetLink(banner.getTargetLink())
                .isActive(banner.isActive())
                .sortOrder(banner.getSortOrder())
                .build();
    }
}