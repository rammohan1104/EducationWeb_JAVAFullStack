package com.edumanage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(name = "file_url", nullable = false, length = 255)
    private String fileUrl;

    @Column(name = "file_type", length = 20)
    private String fileType = "PDF"; // PDF, DOCX, PPT, ZIP

    @Column(name = "file_size", length = 50)
    private String fileSize;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Note() {}

    public static NoteBuilder builder() { return new NoteBuilder(); }

    public static class NoteBuilder {
        private Long id;
        private Course course;
        private Batch batch;
        private String title;
        private String description;
        private String fileUrl;
        private String fileType = "PDF";
        private String fileSize;

        public NoteBuilder id(Long id) { this.id = id; return this; }
        public NoteBuilder course(Course course) { this.course = course; return this; }
        public NoteBuilder batch(Batch batch) { this.batch = batch; return this; }
        public NoteBuilder title(String title) { this.title = title; return this; }
        public NoteBuilder description(String description) { this.description = description; return this; }
        public NoteBuilder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public NoteBuilder fileType(String fileType) { this.fileType = fileType; return this; }
        public NoteBuilder fileSize(String fileSize) { this.fileSize = fileSize; return this; }

        public Note build() {
            Note n = new Note();
            n.id = this.id;
            n.course = this.course;
            n.batch = this.batch;
            n.title = this.title;
            n.description = this.description;
            n.fileUrl = this.fileUrl;
            n.fileType = this.fileType != null ? this.fileType : "PDF";
            n.fileSize = this.fileSize;
            return n;
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

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
