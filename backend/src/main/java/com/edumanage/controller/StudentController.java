package com.edumanage.controller;

import com.edumanage.dto.request.StudentProfileUpdateRequest;
import com.edumanage.dto.response.ApiResponse;
import com.edumanage.entity.Enrollment;
import com.edumanage.entity.StudentProfile;
import com.edumanage.entity.User;
import com.edumanage.security.UserDetailsImpl;
import com.edumanage.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Students", description = "Endpoints for student profiles, enrollments, and admin student directory")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Student Endpoints
    @GetMapping({"/student/enrollments", "/student/my-enrollments"})
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Get all enrolled courses and batch schedules")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getMyEnrollments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Enrollment> enrollments = studentService.getStudentEnrollments(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(enrollments));
    }

    @GetMapping("/student/profile")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Get personal 16-field profile")
    public ResponseEntity<ApiResponse<StudentProfile>> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        StudentProfile profile = studentService.getProfileByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/student/profile")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Update personal 16-field profile")
    public ResponseEntity<ApiResponse<StudentProfile>> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody StudentProfileUpdateRequest request
    ) {
        StudentProfile profile = studentService.updateStudentProfile(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
    }

    // Admin Endpoints
    @GetMapping("/admin/students")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all students with complete profile details")
    public ResponseEntity<ApiResponse<List<User>>> getAllStudents() {
        List<User> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.ok(students));
    }

    @GetMapping("/admin/students/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get complete details of a student by ID")
    public ResponseEntity<ApiResponse<User>> getStudentById(@PathVariable Long id) {
        User student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.ok(student));
    }

    @PutMapping("/admin/students/{id}/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Update student profile details")
    public ResponseEntity<ApiResponse<StudentProfile>> adminUpdateStudentProfile(
            @PathVariable Long id,
            @Valid @RequestBody StudentProfileUpdateRequest request
    ) {
        StudentProfile profile = studentService.updateStudentProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Student profile updated successfully", profile));
    }

    @PatchMapping("/admin/students/{id}/toggle-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Suspend or activate student account")
    public ResponseEntity<ApiResponse<User>> toggleStudentStatus(@PathVariable Long id) {
        User user = studentService.toggleStudentStatus(id);
        String msg = Boolean.TRUE.equals(user.getIsActive()) ? "Student account activated." : "Student account suspended.";
        return ResponseEntity.ok(ApiResponse.ok(msg, user));
    }

    @DeleteMapping("/admin/students/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete student account")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.ok("Student deleted successfully", null));
    }
}
