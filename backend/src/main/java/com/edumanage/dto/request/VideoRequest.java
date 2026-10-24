package com.edumanage.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VideoRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private Long batchId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String videoType = "RECORDED";

    @NotBlank(message = "Video URL is required")
    private String videoUrl;

    private String duration;
    private Integer sequenceOrder = 1;

    public VideoRequest() {}

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

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
}
