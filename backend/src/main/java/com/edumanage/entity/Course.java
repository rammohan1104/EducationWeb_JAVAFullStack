package com.edumanage.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 150)
    private String slug;

    @Column(name = "short_description", length = 300)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 60)
    private String duration;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fees;

    @Column(length = 50)
    private String category;

    @Column(length = 50)
    private String level;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Column(columnDefinition = "TEXT")
    private String syllabus;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Batch> batches = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Course() {}

    public static CourseBuilder builder() { return new CourseBuilder(); }

    public static class CourseBuilder {
        private Long id;
        private String title;
        private String slug;
        private String shortDescription;
        private String description;
        private String duration;
        private BigDecimal fees;
        private String category;
        private String level;
        private String thumbnailUrl;
        private String syllabus;
        private Boolean isActive = true;

        public CourseBuilder id(Long id) { this.id = id; return this; }
        public CourseBuilder title(String title) { this.title = title; return this; }
        public CourseBuilder slug(String slug) { this.slug = slug; return this; }
        public CourseBuilder shortDescription(String shortDescription) { this.shortDescription = shortDescription; return this; }
        public CourseBuilder description(String description) { this.description = description; return this; }
        public CourseBuilder duration(String duration) { this.duration = duration; return this; }
        public CourseBuilder fees(BigDecimal fees) { this.fees = fees; return this; }
        public CourseBuilder category(String category) { this.category = category; return this; }
        public CourseBuilder level(String level) { this.level = level; return this; }
        public CourseBuilder thumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; return this; }
        public CourseBuilder syllabus(String syllabus) { this.syllabus = syllabus; return this; }
        public CourseBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }

        public Course build() {
            Course c = new Course();
            c.id = this.id;
            c.title = this.title;
            c.slug = this.slug;
            c.shortDescription = this.shortDescription;
            c.description = this.description;
            c.duration = this.duration;
            c.fees = this.fees;
            c.category = this.category;
            c.level = this.level;
            c.thumbnailUrl = this.thumbnailUrl;
            c.syllabus = this.syllabus;
            c.isActive = this.isActive != null ? this.isActive : true;
            return c;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public BigDecimal getFees() { return fees; }
    public void setFees(BigDecimal fees) { this.fees = fees; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getSyllabus() { return syllabus; }
    public void setSyllabus(String syllabus) { this.syllabus = syllabus; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<Batch> getBatches() { return batches; }
    public void setBatches(List<Batch> batches) { this.batches = batches; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
