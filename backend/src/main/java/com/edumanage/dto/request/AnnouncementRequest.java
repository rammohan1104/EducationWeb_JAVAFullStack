package com.edumanage.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AnnouncementRequest {

    private Long courseId;
    private Long batchId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String priority = "NORMAL";

    public AnnouncementRequest() {}

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
