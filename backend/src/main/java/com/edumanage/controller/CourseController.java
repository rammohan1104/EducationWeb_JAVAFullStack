package com.edumanage.controller;

import com.edumanage.dto.request.CourseRequest;
import com.edumanage.dto.response.ApiResponse;
import com.edumanage.entity.Course;
import com.edumanage.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Courses", description = "Endpoints for course catalog, details, and admin course management")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Public Endpoints
    @GetMapping("/courses/public")
    @Operation(summary = "Get all active courses for public catalog")
    public ResponseEntity<ApiResponse<List<Course>>> getPublicCourses() {
        List<Course> courses = courseService.getAllActiveCourses();
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }

    @GetMapping("/courses/public/{id}")
    @Operation(summary = "Get public course details by id")
    public ResponseEntity<ApiResponse<Course>> getPublicCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.ok(course));
    }

    // Admin Endpoints
    @GetMapping("/admin/courses")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all courses (active and inactive)")
    public ResponseEntity<ApiResponse<List<Course>>> getAllCoursesAdmin() {
        List<Course> courses = courseService.getAllCoursesAdmin();
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }

    @PostMapping("/admin/courses")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Add a new course")
    public ResponseEntity<ApiResponse<Course>> createCourse(@Valid @RequestBody CourseRequest request) {
        Course course = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Course created successfully", course));
    }

    @PutMapping("/admin/courses/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Update course details")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        Course course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Course updated successfully", course));
    }

    @PatchMapping("/admin/courses/{id}/toggle-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Activate or deactivate a course")
    public ResponseEntity<ApiResponse<Course>> toggleCourseStatus(@PathVariable Long id) {
        Course course = courseService.toggleCourseStatus(id);
        return ResponseEntity.ok(ApiResponse.ok("Course status updated", course));
    }

    @DeleteMapping("/admin/courses/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete course")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted successfully", null));
    }
}
