package com.edumanage.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "batches")
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonBackReference
    private Course course;

    @NotBlank
    @Column(name = "batch_name", nullable = false, length = 100)
    private String batchName;

    @Column(name = "batch_code", length = 50)
    private String batchCode;

    @Column(name = "schedule_time", length = 100)
    private String scheduleTime;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "max_capacity")
    private Integer maxCapacity = 50;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Batch() {}

    public static BatchBuilder builder() { return new BatchBuilder(); }

    public static class BatchBuilder {
        private Long id;
        private Course course;
        private String batchName;
        private String batchCode;
        private String scheduleTime;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer maxCapacity = 50;
        private Boolean isActive = true;

        public BatchBuilder id(Long id) { this.id = id; return this; }
        public BatchBuilder course(Course course) { this.course = course; return this; }
        public BatchBuilder batchName(String batchName) { this.batchName = batchName; return this; }
        public BatchBuilder batchCode(String batchCode) { this.batchCode = batchCode; return this; }
        public BatchBuilder scheduleTime(String scheduleTime) { this.scheduleTime = scheduleTime; return this; }
        public BatchBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public BatchBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public BatchBuilder maxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; return this; }
        public BatchBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }

        public Batch build() {
            Batch b = new Batch();
            b.id = this.id;
            b.course = this.course;
            b.batchName = this.batchName;
            b.batchCode = this.batchCode;
            b.scheduleTime = this.scheduleTime;
            b.startDate = this.startDate;
            b.endDate = this.endDate;
            b.maxCapacity = this.maxCapacity != null ? this.maxCapacity : 50;
            b.isActive = this.isActive != null ? this.isActive : true;
            return b;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public String getBatchCode() { return batchCode; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }

    public String getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(String scheduleTime) { this.scheduleTime = scheduleTime; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
