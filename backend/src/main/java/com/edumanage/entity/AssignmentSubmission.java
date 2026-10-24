package com.edumanage.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"assignment_id", "user_id"})
})
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "submission_text", columnDefinition = "TEXT")
    private String submissionText;

    @Column(name = "file_url", length = 255)
    private String fileUrl;

    @Column(name = "score")
    private Integer score;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(length = 20)
    private String status = "SUBMITTED"; // SUBMITTED, GRADED, RESUBMIT

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;

    public AssignmentSubmission() {}

    public static AssignmentSubmissionBuilder builder() { return new AssignmentSubmissionBuilder(); }

    public static class AssignmentSubmissionBuilder {
        private Long id;
        private Assignment assignment;
        private User user;
        private String submissionText;
        private String fileUrl;
        private Integer score;
        private String feedback;
        private String status = "SUBMITTED";

        public AssignmentSubmissionBuilder id(Long id) { this.id = id; return this; }
        public AssignmentSubmissionBuilder assignment(Assignment assignment) { this.assignment = assignment; return this; }
        public AssignmentSubmissionBuilder user(User user) { this.user = user; return this; }
        public AssignmentSubmissionBuilder submissionText(String submissionText) { this.submissionText = submissionText; return this; }
        public AssignmentSubmissionBuilder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public AssignmentSubmissionBuilder score(Integer score) { this.score = score; return this; }
        public AssignmentSubmissionBuilder feedback(String feedback) { this.feedback = feedback; return this; }
        public AssignmentSubmissionBuilder status(String status) { this.status = status; return this; }

        public AssignmentSubmission build() {
            AssignmentSubmission sub = new AssignmentSubmission();
            sub.id = this.id;
            sub.assignment = this.assignment;
            sub.user = this.user;
            sub.submissionText = this.submissionText;
            sub.fileUrl = this.fileUrl;
            sub.score = this.score;
            sub.feedback = this.feedback;
            sub.status = this.status != null ? this.status : "SUBMITTED";
            return sub;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSubmissionText() { return submissionText; }
    public void setSubmissionText(String submissionText) { this.submissionText = submissionText; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
