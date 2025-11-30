// File: com/project/btl/dto/response/BannerResponse.java
package com.project.btl.dto.response;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class BannerResponse {
    private Integer bannerId;
    private String title;
    private String imageUrlDesktop;
    private String imageUrlMobile;
    private String targetLink;
    private boolean isActive;
    private int sortOrder;
}