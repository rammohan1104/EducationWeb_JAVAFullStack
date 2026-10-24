package com.edumanage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "batches"})
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "course"})
    private Batch batch;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Column(name = "utr_number", nullable = false, unique = true, length = 100)
    private String utrNumber;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "screenshot_url", length = 255)
    private String screenshotUrl;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Payment() {}

    public static PaymentBuilder builder() { return new PaymentBuilder(); }

    public static class PaymentBuilder {
        private Long id;
        private User user;
        private Course course;
        private Batch batch;
        private BigDecimal amount;
        private String utrNumber;
        private LocalDate paymentDate;
        private String screenshotUrl;
        private String upiId;
        private PaymentStatus status = PaymentStatus.PENDING;
        private String rejectionReason;
        private User verifiedBy;
        private LocalDateTime verifiedAt;

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder user(User user) { this.user = user; return this; }
        public PaymentBuilder course(Course course) { this.course = course; return this; }
        public PaymentBuilder batch(Batch batch) { this.batch = batch; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder utrNumber(String utrNumber) { this.utrNumber = utrNumber; return this; }
        public PaymentBuilder paymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; return this; }
        public PaymentBuilder screenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; return this; }
        public PaymentBuilder upiId(String upiId) { this.upiId = upiId; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public PaymentBuilder verifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; return this; }
        public PaymentBuilder verifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; return this; }

        public Payment build() {
            Payment p = new Payment();
            p.id = this.id;
            p.user = this.user;
            p.course = this.course;
            p.batch = this.batch;
            p.amount = this.amount;
            p.utrNumber = this.utrNumber;
            p.paymentDate = this.paymentDate;
            p.screenshotUrl = this.screenshotUrl;
            p.upiId = this.upiId;
            p.status = this.status != null ? this.status : PaymentStatus.PENDING;
            p.rejectionReason = this.rejectionReason;
            p.verifiedBy = this.verifiedBy;
            p.verifiedAt = this.verifiedAt;
            return p;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Batch getBatch() { return batch; }
    public void setBatch(Batch batch) { this.batch = batch; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getScreenshotUrl() { return screenshotUrl; }
    public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public User getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
