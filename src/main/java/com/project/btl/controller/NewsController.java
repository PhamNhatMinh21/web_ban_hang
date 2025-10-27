package com.project.btl.controller;

import com.project.btl.model.News;
import com.project.btl.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/news")
public class NewsController {

    // Dùng trực tiếp Repository cho đơn giản
    @Autowired
    private NewsRepository newsRepository;

    // AI CŨNG CÓ THỂ XEM
    @GetMapping
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    // CHỈ ADMIN ĐƯỢS ĐĂNG TIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public News createNews(@RequestBody News news) {
        return newsRepository.save(news);
    }

    // CHỈ ADMIN ĐƯỢC XÓA
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}