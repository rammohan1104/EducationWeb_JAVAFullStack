package com.edumanage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 20)
    private String priority = "NORMAL"; // LOW, NORMAL, URGENT

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Announcement() {}

    public static AnnouncementBuilder builder() { return new AnnouncementBuilder(); }

    public static class AnnouncementBuilder {
        private Long id;
        private Course course;
        private Batch batch;
        private String title;
        private String content;
        private String priority = "NORMAL";
        private String createdBy;

        public AnnouncementBuilder id(Long id) { this.id = id; return this; }
        public AnnouncementBuilder course(Course course) { this.course = course; return this; }
        public AnnouncementBuilder batch(Batch batch) { this.batch = batch; return this; }
        public AnnouncementBuilder title(String title) { this.title = title; return this; }
        public AnnouncementBuilder content(String content) { this.content = content; return this; }
        public AnnouncementBuilder priority(String priority) { this.priority = priority; return this; }
        public AnnouncementBuilder createdBy(String createdBy) { this.createdBy = createdBy; return this; }

        public Announcement build() {
            Announcement a = new Announcement();
            a.id = this.id;
            a.course = this.course;
            a.batch = this.batch;
            a.title = this.title;
            a.content = this.content;
            a.priority = this.priority != null ? this.priority : "NORMAL";
            a.createdBy = this.createdBy;
            return a;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Batch getBatch() { return batch; }
    public void setBatch(Batch batch) { this.batch = batch; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
