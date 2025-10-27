package com.project.btl.security.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.btl.model.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;
    @JsonIgnore // Không trả về password trong API
    private String password;
    private String fullName;
    private String address;

    // Lưu các quyền (ROLE_USER, ROLE_ADMIN)
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String password, String fullName, String address,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.address = address;
        this.authorities = authorities;
    }

    // Hàm static để "build" UserDetails từ User (lấy từ DB)
    public static UserDetailsImpl build(User user) {
        // Chuyển Set<Role> thành List<GrantedAuthority>
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getFullName(),
                user.getAddress(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return username; }

    // Các hàm này ta để true (không khóa tài khoản)
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}