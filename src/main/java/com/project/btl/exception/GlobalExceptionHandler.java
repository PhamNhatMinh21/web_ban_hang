// File: com/project/btl/exception/GlobalExceptionHandler.java
package com.project.btl.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice // "Lắng nghe" tất cả các Exception trong Controller
public class GlobalExceptionHandler {

    // Bắt cụ thể lỗi ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value()); // 404
        body.put("error", "Not Found");
        body.put("message", ex.getMessage()); // Lấy thông báo từ Service
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // Bạn có thể thêm các @ExceptionHandler khác ở đây
}