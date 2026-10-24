package com.edumanage.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GroupMessageRequest {

    @NotNull(message = "Batch ID is required")
    private Long batchId;

    @NotBlank(message = "Message content is required")
    private String message;

    private String attachmentUrl;
    private Boolean isAnnouncement = false;

    public GroupMessageRequest() {}

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public Boolean getIsAnnouncement() { return isAnnouncement; }
    public void setIsAnnouncement(Boolean isAnnouncement) { this.isAnnouncement = isAnnouncement; }
}
