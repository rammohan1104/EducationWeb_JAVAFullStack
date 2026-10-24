package com.edumanage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

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

    @Column(name = "file_url", length = 255)
    private String fileUrl;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "max_score")
    private Integer maxScore = 100;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Assignment() {}

    public static AssignmentBuilder builder() { return new AssignmentBuilder(); }

    public static class AssignmentBuilder {
        private Long id;
        private Course course;
        private Batch batch;
        private String title;
        private String description;
        private String fileUrl;
        private LocalDate dueDate;
        private Integer maxScore = 100;

        public AssignmentBuilder id(Long id) { this.id = id; return this; }
        public AssignmentBuilder course(Course course) { this.course = course; return this; }
        public AssignmentBuilder batch(Batch batch) { this.batch = batch; return this; }
        public AssignmentBuilder title(String title) { this.title = title; return this; }
        public AssignmentBuilder description(String description) { this.description = description; return this; }
        public AssignmentBuilder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public AssignmentBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public AssignmentBuilder maxScore(Integer maxScore) { this.maxScore = maxScore; return this; }

        public Assignment build() {
            Assignment a = new Assignment();
            a.id = this.id;
            a.course = this.course;
            a.batch = this.batch;
            a.title = this.title;
            a.description = this.description;
            a.fileUrl = this.fileUrl;
            a.dueDate = this.dueDate;
            a.maxScore = this.maxScore != null ? this.maxScore : 100;
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

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
