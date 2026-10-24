package com.edumanage.service;

import com.edumanage.dto.request.*;
import com.edumanage.entity.*;
import com.edumanage.exception.ResourceNotFoundException;
import com.edumanage.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LearningService {

    private final VideoRepository videoRepository;
    private final NoteRepository noteRepository;
    private final AnnouncementRepository announcementRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;

    public LearningService(
            VideoRepository videoRepository,
            NoteRepository noteRepository,
            AnnouncementRepository announcementRepository,
            AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            GroupMessageRepository groupMessageRepository,
            CourseRepository courseRepository,
            BatchRepository batchRepository,
            UserRepository userRepository
    ) {
        this.videoRepository = videoRepository;
        this.noteRepository = noteRepository;
        this.announcementRepository = announcementRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.courseRepository = courseRepository;
        this.batchRepository = batchRepository;
        this.userRepository = userRepository;
    }

    // --- VIDEOS ---
    public List<Video> getVideosByCourse(Long courseId) {
        return videoRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);
    }

    public List<Video> getVideosByBatch(Long batchId) {
        return videoRepository.findByBatchIdOrderBySequenceOrderAsc(batchId);
    }

    @Transactional
    public Video createVideo(VideoRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Batch batch = null;
        if (request.getBatchId() != null) {
            batch = batchRepository.findById(request.getBatchId()).orElse(null);
        }

        Video video = Video.builder()
                .course(course)
                .batch(batch)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoType(request.getVideoType() != null ? request.getVideoType() : "RECORDED")
                .videoUrl(request.getVideoUrl())
                .duration(request.getDuration())
                .sequenceOrder(request.getSequenceOrder() != null ? request.getSequenceOrder() : 1)
                .build();

        return videoRepository.save(video);
    }

    @Transactional
    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }

    // --- NOTES ---
    public List<Note> getNotesByCourse(Long courseId) {
        return noteRepository.findByCourseId(courseId);
    }

    public List<Note> getNotesByBatch(Long batchId) {
        return noteRepository.findByBatchId(batchId);
    }

    @Transactional
    public Note createNote(NoteRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Batch batch = null;
        if (request.getBatchId() != null) {
            batch = batchRepository.findById(request.getBatchId()).orElse(null);
        }

        Note note = Note.builder()
                .course(course)
                .batch(batch)
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .fileType(request.getFileType() != null ? request.getFileType() : "PDF")
                .fileSize(request.getFileSize())
                .build();

        return noteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    // --- ANNOUNCEMENTS ---
    public List<Announcement> getAllAnnouncementsAdmin() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Announcement> getAnnouncementsForStudent(Long courseId, Long batchId) {
        return announcementRepository.findAnnouncementsForStudent(courseId, batchId);
    }

    @Transactional
    public Announcement createAnnouncement(AnnouncementRequest request, String createdBy) {
        Course course = request.getCourseId() != null ? courseRepository.findById(request.getCourseId()).orElse(null) : null;
        Batch batch = request.getBatchId() != null ? batchRepository.findById(request.getBatchId()).orElse(null) : null;

        Announcement announcement = Announcement.builder()
                .course(course)
                .batch(batch)
                .title(request.getTitle())
                .content(request.getContent())
                .priority(request.getPriority() != null ? request.getPriority() : "NORMAL")
                .createdBy(createdBy)
                .build();

        return announcementRepository.save(announcement);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    // --- ASSIGNMENTS & SUBMISSIONS ---
    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    @Transactional
    public Assignment createAssignment(AssignmentRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Batch batch = request.getBatchId() != null ? batchRepository.findById(request.getBatchId()).orElse(null) : null;

        Assignment assignment = Assignment.builder()
                .course(course)
                .batch(batch)
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .dueDate(request.getDueDate())
                .maxScore(request.getMaxScore() != null ? request.getMaxScore() : 100)
                .build();

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    public List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Transactional
    public AssignmentSubmission submitAssignment(Long assignmentId, Long userId, AssignmentSubmissionRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AssignmentSubmission submission = submissionRepository.findByAssignmentIdAndUserId(assignmentId, userId)
                .orElseGet(() -> AssignmentSubmission.builder()
                        .assignment(assignment)
                        .user(user)
                        .build());

        submission.setSubmissionText(request.getSubmissionText());
        if (request.getFileUrl() != null && !request.getFileUrl().isBlank()) {
            submission.setFileUrl(request.getFileUrl());
        }
        submission.setStatus("SUBMITTED");

        return submissionRepository.save(submission);
    }

    @Transactional
    public AssignmentSubmission gradeSubmission(Long submissionId, Integer score, String feedback) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setStatus("GRADED");
        return submissionRepository.save(submission);
    }

    // --- BATCH GROUP MESSAGES ---
    public List<GroupMessage> getGroupMessages(Long batchId) {
        return groupMessageRepository.findByBatchIdWithSender(batchId);
    }

    @Transactional
    public GroupMessage postGroupMessage(Long userId, GroupMessageRequest request) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        GroupMessage message = GroupMessage.builder()
                .batch(batch)
                .user(user)
                .message(request.getMessage())
                .attachmentUrl(request.getAttachmentUrl())
                .isAnnouncement(request.getIsAnnouncement() != null ? request.getIsAnnouncement() : false)
                .build();

        return groupMessageRepository.save(message);
    }
}
