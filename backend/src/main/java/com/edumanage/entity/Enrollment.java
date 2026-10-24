package com.edumanage.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "course_id"})
})
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status = EnrollmentStatus.PENDING;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "certificate_issued", nullable = false)
    private Boolean certificateIssued = false;

    @Column(name = "certificate_url", length = 255)
    private String certificateUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Enrollment() {}

    public static EnrollmentBuilder builder() { return new EnrollmentBuilder(); }

    public static class EnrollmentBuilder {
        private Long id;
        private User user;
        private Course course;
        private Batch batch;
        private EnrollmentStatus status = EnrollmentStatus.PENDING;
        private LocalDateTime enrolledAt;
        private Boolean certificateIssued = false;
        private String certificateUrl;

        public EnrollmentBuilder id(Long id) { this.id = id; return this; }
        public EnrollmentBuilder user(User user) { this.user = user; return this; }
        public EnrollmentBuilder course(Course course) { this.course = course; return this; }
        public EnrollmentBuilder batch(Batch batch) { this.batch = batch; return this; }
        public EnrollmentBuilder status(EnrollmentStatus status) { this.status = status; return this; }
        public EnrollmentBuilder enrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; return this; }
        public EnrollmentBuilder certificateIssued(Boolean certificateIssued) { this.certificateIssued = certificateIssued; return this; }
        public EnrollmentBuilder certificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; return this; }

        public Enrollment build() {
            Enrollment e = new Enrollment();
            e.id = this.id;
            e.user = this.user;
            e.course = this.course;
            e.batch = this.batch;
            e.status = this.status != null ? this.status : EnrollmentStatus.PENDING;
            e.enrolledAt = this.enrolledAt;
            e.certificateIssued = this.certificateIssued != null ? this.certificateIssued : false;
            e.certificateUrl = this.certificateUrl;
            return e;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Batch getBatch() { return batch; }
    public void setBatch(Batch batch) { this.batch = batch; }

    public EnrollmentStatus getStatus() { return status; }
    public void setStatus(EnrollmentStatus status) { this.status = status; }

    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }

    public Boolean getCertificateIssued() { return certificateIssued; }
    public void setCertificateIssued(Boolean certificateIssued) { this.certificateIssued = certificateIssued; }

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
