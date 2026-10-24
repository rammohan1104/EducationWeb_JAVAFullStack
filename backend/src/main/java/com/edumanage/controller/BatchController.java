package com.edumanage.controller;

import com.edumanage.dto.request.BatchRequest;
import com.edumanage.dto.response.ApiResponse;
import com.edumanage.entity.Batch;
import com.edumanage.entity.Enrollment;
import com.edumanage.service.BatchService;
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
@Tag(name = "Batches", description = "Endpoints for batch management, schedules, and student assignment")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @GetMapping("/courses/public/{courseId}/batches")
    @Operation(summary = "Get active batches for a course")
    public ResponseEntity<ApiResponse<List<Batch>>> getBatchesByCourse(@PathVariable Long courseId) {
        List<Batch> batches = batchService.getBatchesByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(batches));
    }

    @GetMapping("/admin/batches")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all batches across all courses")
    public ResponseEntity<ApiResponse<List<Batch>>> getAllBatches() {
        List<Batch> batches = batchService.getAllBatches();
        return ResponseEntity.ok(ApiResponse.ok(batches));
    }

    @GetMapping("/admin/batches/course/{courseId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all batches for specific course")
    public ResponseEntity<ApiResponse<List<Batch>>> getAdminBatchesByCourse(@PathVariable Long courseId) {
        List<Batch> batches = batchService.getBatchesByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(batches));
    }

    @PostMapping("/admin/batches")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Create a new batch for a course")
    public ResponseEntity<ApiResponse<Batch>> createBatch(@Valid @RequestBody BatchRequest request) {
        Batch batch = batchService.createBatch(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Batch created successfully", batch));
    }

    @PutMapping("/admin/batches/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Update batch details")
    public ResponseEntity<ApiResponse<Batch>> updateBatch(@PathVariable Long id, @Valid @RequestBody BatchRequest request) {
        Batch batch = batchService.updateBatch(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Batch updated successfully", batch));
    }

    @DeleteMapping("/admin/batches/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete batch")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.ok(ApiResponse.ok("Batch deleted successfully", null));
    }

    @GetMapping("/admin/batches/{batchId}/students")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all students enrolled in a specific batch")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getStudentsInBatch(@PathVariable Long batchId) {
        List<Enrollment> enrollments = batchService.getStudentsByBatch(batchId);
        return ResponseEntity.ok(ApiResponse.ok(enrollments));
    }

    @PostMapping("/admin/batches/assign-student")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Assign a student enrollment to a batch")
    public ResponseEntity<ApiResponse<Enrollment>> assignStudentToBatch(
            @RequestParam Long enrollmentId,
            @RequestParam Long batchId
    ) {
        Enrollment enrollment = batchService.assignStudentToBatch(enrollmentId, batchId);
        return ResponseEntity.ok(ApiResponse.ok("Student assigned to batch successfully", enrollment));
    }

    @PostMapping("/admin/batches/remove-student/{enrollmentId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Remove student from batch")
    public ResponseEntity<ApiResponse<Enrollment>> removeStudentFromBatch(@PathVariable Long enrollmentId) {
        Enrollment enrollment = batchService.removeStudentFromBatch(enrollmentId);
        return ResponseEntity.ok(ApiResponse.ok("Student removed from batch", enrollment));
    }
}
