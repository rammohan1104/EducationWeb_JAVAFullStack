package com.edumanage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
public class Video {

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

    @Column(name = "video_type", length = 30)
    private String videoType = "RECORDED"; // RECORDED, YOUTUBE, LIVE

    @NotBlank
    @Column(name = "video_url", nullable = false, length = 255)
    private String videoUrl;

    @Column(length = 50)
    private String duration;

    @Column(name = "sequence_order")
    private Integer sequenceOrder = 1;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Video() {}

    public static VideoBuilder builder() { return new VideoBuilder(); }

    public static class VideoBuilder {
        private Long id;
        private Course course;
        private Batch batch;
        private String title;
        private String description;
        private String videoType = "RECORDED";
        private String videoUrl;
        private String duration;
        private Integer sequenceOrder = 1;

        public VideoBuilder id(Long id) { this.id = id; return this; }
        public VideoBuilder course(Course course) { this.course = course; return this; }
        public VideoBuilder batch(Batch batch) { this.batch = batch; return this; }
        public VideoBuilder title(String title) { this.title = title; return this; }
        public VideoBuilder description(String description) { this.description = description; return this; }
        public VideoBuilder videoType(String videoType) { this.videoType = videoType; return this; }
        public VideoBuilder videoUrl(String videoUrl) { this.videoUrl = videoUrl; return this; }
        public VideoBuilder duration(String duration) { this.duration = duration; return this; }
        public VideoBuilder sequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; return this; }

        public Video build() {
            Video v = new Video();
            v.id = this.id;
            v.course = this.course;
            v.batch = this.batch;
            v.title = this.title;
            v.description = this.description;
            v.videoType = this.videoType != null ? this.videoType : "RECORDED";
            v.videoUrl = this.videoUrl;
            v.duration = this.duration;
            v.sequenceOrder = this.sequenceOrder != null ? this.sequenceOrder : 1;
            return v;
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

    public String getVideoType() { return videoType; }
    public void setVideoType(String videoType) { this.videoType = videoType; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
