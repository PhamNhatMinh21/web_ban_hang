package com.project.btl.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Xử lý lỗi: ResourceNotFoundException (HTTP 404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value()); // 404
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // 2. Xử lý lỗi: MethodArgumentNotValidException (Validation) (HTTP 400)
    // Lỗi này xảy ra khi các ràng buộc @NotBlank, @NotNull, v.v. trong DTO bị vi phạm.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        // Lấy danh sách các lỗi chi tiết (tên trường và thông báo lỗi)
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,       // Tên trường bị lỗi
                        FieldError::getDefaultMessage // Thông báo lỗi (message)
                ));

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value()); // 400
        body.put("message", "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra các trường.");
        body.put("errors", errors); // Trả về chi tiết các lỗi

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 3. Xử lý lỗi chung (Internal Server Error) (HTTP 500)
    // Tùy chọn: Có thể thêm để bắt tất cả các lỗi còn lại
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
        body.put("error", "Internal Server Error");
        body.put("message", "Có lỗi xảy ra trên máy chủ: " + ex.getLocalizedMessage());

        // GHI LOG LỖI VÀO CONSOLE ĐỂ DEBUG
        ex.printStackTrace();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}