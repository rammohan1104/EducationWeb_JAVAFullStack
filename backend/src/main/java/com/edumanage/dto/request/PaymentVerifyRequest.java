package com.edumanage.dto.request;

import com.edumanage.entity.PaymentStatus;

public class PaymentVerifyRequest {

    private PaymentStatus status;
    private Boolean approved;
    private String rejectionReason;
    private Long batchId;

    public PaymentVerifyRequest() {}

    public PaymentStatus getStatus() {
        if (status != null) {
            return status;
        }
        if (approved != null) {
            return approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;
        }
        return PaymentStatus.APPROVED;
    }

    public void setStatus(PaymentStatus status) { this.status = status; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }
}
