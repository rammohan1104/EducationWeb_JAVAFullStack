package com.edumanage.controller;

import com.edumanage.dto.request.*;
import com.edumanage.dto.response.ApiResponse;
import com.edumanage.entity.*;
import com.edumanage.security.UserDetailsImpl;
import com.edumanage.service.LearningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Learning Portal", description = "Endpoints for videos, notes, announcements, assignments, and batch groups")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    // --- VIDEOS ---
    @GetMapping({"/student/learning/course/{courseId}/videos", "/courses/public/{courseId}/videos"})
    @Operation(summary = "Get videos for a course")
    public ResponseEntity<ApiResponse<List<Video>>> getCourseVideos(@PathVariable Long courseId) {
        List<Video> videos = learningService.getVideosByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(videos));
    }

    @GetMapping("/student/learning/batch/{batchId}/videos")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Get videos for a specific batch")
    public ResponseEntity<ApiResponse<List<Video>>> getBatchVideos(@PathVariable Long batchId) {
        List<Video> videos = learningService.getVideosByBatch(batchId);
        return ResponseEntity.ok(ApiResponse.ok(videos));
    }

    @PostMapping("/admin/learning/videos")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Upload/Add a new video class (Recorded, YouTube, Live link)")
    public ResponseEntity<ApiResponse<Video>> createVideo(@Valid @RequestBody VideoRequest request) {
        Video video = learningService.createVideo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Video added successfully", video));
    }

    @DeleteMapping("/admin/learning/videos/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete a video")
    public ResponseEntity<ApiResponse<Void>> deleteVideo(@PathVariable Long id) {
        learningService.deleteVideo(id);
        return ResponseEntity.ok(ApiResponse.ok("Video deleted successfully", null));
    }

    // --- NOTES ---
    @GetMapping({"/student/learning/course/{courseId}/notes", "/courses/public/{courseId}/notes"})
    @Operation(summary = "Get downloadable notes for a course")
    public ResponseEntity<ApiResponse<List<Note>>> getCourseNotes(@PathVariable Long courseId) {
        List<Note> notes = learningService.getNotesByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(notes));
    }

    @GetMapping("/student/learning/batch/{batchId}/notes")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Get notes for a specific batch")
    public ResponseEntity<ApiResponse<List<Note>>> getBatchNotes(@PathVariable Long batchId) {
        List<Note> notes = learningService.getNotesByBatch(batchId);
        return ResponseEntity.ok(ApiResponse.ok(notes));
    }

    @PostMapping("/admin/learning/notes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Upload a new note (PDF, DOCX, PPT, ZIP)")
    public ResponseEntity<ApiResponse<Note>> createNote(@Valid @RequestBody NoteRequest request) {
        Note note = learningService.createNote(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Note uploaded successfully", note));
    }

    @DeleteMapping("/admin/learning/notes/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete note")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        learningService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully", null));
    }

    // --- ANNOUNCEMENTS ---
    @GetMapping("/student/learning/announcements")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Get announcements for enrolled course and batch")
    public ResponseEntity<ApiResponse<List<Announcement>>> getStudentAnnouncements(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long batchId
    ) {
        List<Announcement> announcements = learningService.getAnnouncementsForStudent(courseId, batchId);
        return ResponseEntity.ok(ApiResponse.ok(announcements));
    }

    @GetMapping("/admin/learning/announcements")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all announcements")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncementsAdmin() {
        List<Announcement> announcements = learningService.getAllAnnouncementsAdmin();
        return ResponseEntity.ok(ApiResponse.ok(announcements));
    }

    @PostMapping("/admin/learning/announcements")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Broadcast a new announcement")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody AnnouncementRequest request
    ) {
        Announcement announcement = learningService.createAnnouncement(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Announcement broadcasted successfully", announcement));
    }

    @DeleteMapping("/admin/learning/announcements/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete announcement")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        learningService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.ok("Announcement deleted successfully", null));
    }

    // --- ASSIGNMENTS & SUBMISSIONS ---
    @GetMapping("/student/learning/course/{courseId}/assignments")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    @Operation(summary = "Get assignments for a course")
    public ResponseEntity<ApiResponse<List<Assignment>>> getCourseAssignments(@PathVariable Long courseId) {
        List<Assignment> assignments = learningService.getAssignmentsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(assignments));
    }

    @PostMapping("/admin/learning/assignments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Create a new assignment")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(@Valid @RequestBody AssignmentRequest request) {
        Assignment assignment = learningService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Assignment created successfully", assignment));
    }

    @DeleteMapping("/admin/learning/assignments/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete assignment")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long id) {
        learningService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment deleted successfully", null));
    }

    @PostMapping("/student/learning/assignments/{assignmentId}/submit")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Submit assignment response")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submitAssignment(
            @PathVariable Long assignmentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AssignmentSubmissionRequest request
    ) {
        AssignmentSubmission submission = learningService.submitAssignment(assignmentId, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Assignment submitted successfully", submission));
    }

    @GetMapping("/admin/learning/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: View student submissions for an assignment")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getSubmissions(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = learningService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(ApiResponse.ok(submissions));
    }

    @PostMapping("/admin/learning/submissions/{submissionId}/grade")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Grade assignment submission")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam Integer score,
            @RequestParam(required = false) String feedback
    ) {
        AssignmentSubmission submission = learningService.gradeSubmission(submissionId, score, feedback);
        return ResponseEntity.ok(ApiResponse.ok("Submission graded successfully", submission));
    }

    // --- BATCH GROUP MESSAGES ---
    @GetMapping("/learning/batch/{batchId}/group-messages")
    @Operation(summary = "Get discussion messages for assigned batch group")
    public ResponseEntity<ApiResponse<List<GroupMessage>>> getGroupMessages(@PathVariable Long batchId) {
        List<GroupMessage> messages = learningService.getGroupMessages(batchId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping("/learning/group-messages")
    @Operation(summary = "Post a message or doubt in batch group")
    public ResponseEntity<ApiResponse<GroupMessage>> postGroupMessage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody GroupMessageRequest request
    ) {
        GroupMessage message = learningService.postGroupMessage(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Message posted", message));
    }
}
