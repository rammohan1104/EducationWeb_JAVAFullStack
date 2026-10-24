package com.edumanage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "group_messages")
public class GroupMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "attachment_url", length = 255)
    private String attachmentUrl;

    @Column(name = "is_announcement", nullable = false)
    private Boolean isAnnouncement = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public GroupMessage() {}

    public static GroupMessageBuilder builder() { return new GroupMessageBuilder(); }

    public static class GroupMessageBuilder {
        private Long id;
        private Batch batch;
        private User user;
        private String message;
        private String attachmentUrl;
        private Boolean isAnnouncement = false;

        public GroupMessageBuilder id(Long id) { this.id = id; return this; }
        public GroupMessageBuilder batch(Batch batch) { this.batch = batch; return this; }
        public GroupMessageBuilder user(User user) { this.user = user; return this; }
        public GroupMessageBuilder message(String message) { this.message = message; return this; }
        public GroupMessageBuilder attachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; return this; }
        public GroupMessageBuilder isAnnouncement(Boolean isAnnouncement) { this.isAnnouncement = isAnnouncement; return this; }

        public GroupMessage build() {
            GroupMessage gm = new GroupMessage();
            gm.id = this.id;
            gm.batch = this.batch;
            gm.user = this.user;
            gm.message = this.message;
            gm.attachmentUrl = this.attachmentUrl;
            gm.isAnnouncement = this.isAnnouncement != null ? this.isAnnouncement : false;
            return gm;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Batch getBatch() { return batch; }
    public void setBatch(Batch batch) { this.batch = batch; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public Boolean getIsAnnouncement() { return isAnnouncement; }
    public void setIsAnnouncement(Boolean isAnnouncement) { this.isAnnouncement = isAnnouncement; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
