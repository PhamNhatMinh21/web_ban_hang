package com.project.btl.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor // Lombok: Tự tạo constructor có đủ 5 tham số
@Getter
@Setter
public class StoreInfoResponse {
    private int id;
    private String name;
    private String address;
    private String phone;
}