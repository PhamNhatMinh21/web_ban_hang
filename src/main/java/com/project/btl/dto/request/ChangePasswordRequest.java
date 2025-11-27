package com.project.btl.dto.request;

import lombok.Data;
@Data
public class ChangePasswordRequest {

        private String oldPassword;
        private String newPassword;
}
