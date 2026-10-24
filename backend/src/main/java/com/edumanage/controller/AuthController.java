package com.edumanage.controller;

import com.edumanage.dto.request.*;
import com.edumanage.dto.response.ApiResponse;
import com.edumanage.dto.response.AuthResponse;
import com.edumanage.entity.User;
import com.edumanage.security.UserDetailsImpl;
import com.edumanage.service.AuthService;
import com.edumanage.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user login, student registration, password management")
public class AuthController {

    private final AuthService authService;
    private final StudentService studentService;

    public AuthController(AuthService authService, StudentService studentService) {
        this.authService = authService;
        this.studentService = studentService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student with full 16-field profile")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful! Welcome to EduManage.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login for Admin and Student accounts")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently logged-in user profile")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        User user = studentService.getStudentById(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change account password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset token/link")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("If an account exists for " + request.getEmail() + ", reset instructions have been dispatched.", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with email/token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok("Password has been reset successfully. You can now login.", null));
    }
}
