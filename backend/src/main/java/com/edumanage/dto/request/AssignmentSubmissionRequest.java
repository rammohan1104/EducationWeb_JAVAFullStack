package com.edumanage.dto.request;

public class AssignmentSubmissionRequest {
    private String submissionText;
    private String fileUrl;

    public AssignmentSubmissionRequest() {}

    public String getSubmissionText() { return submissionText; }
    public void setSubmissionText(String submissionText) { this.submissionText = submissionText; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
