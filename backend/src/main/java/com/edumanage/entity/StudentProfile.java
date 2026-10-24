package com.edumanage.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @NotBlank
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "mother_name", length = 100)
    private String motherName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "mobile_number", length = 20)
    private String mobileNumber;

    @Column(name = "whatsapp_number", length = 20)
    private String whatsappNumber;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 60)
    private String city;

    @Column(name = "state", length = 60)
    private String state;

    @Column(name = "pin_code", length = 20)
    private String pinCode;

    @Column(name = "qualification", length = 100)
    private String qualification;

    @Column(name = "college_university", length = 150)
    private String collegeUniversity;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "profile_photo_url", length = 255)
    private String profilePhotoUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentProfile() {}

    public static StudentProfileBuilder builder() {
        return new StudentProfileBuilder();
    }

    public static class StudentProfileBuilder {
        private Long id;
        private User user;
        private String fullName;
        private String fatherName;
        private String motherName;
        private LocalDate dob;
        private String gender;
        private String mobileNumber;
        private String whatsappNumber;
        private String address;
        private String city;
        private String state;
        private String pinCode;
        private String qualification;
        private String collegeUniversity;
        private String occupation;
        private String profilePhotoUrl;

        public StudentProfileBuilder id(Long id) { this.id = id; return this; }
        public StudentProfileBuilder user(User user) { this.user = user; return this; }
        public StudentProfileBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public StudentProfileBuilder fatherName(String fatherName) { this.fatherName = fatherName; return this; }
        public StudentProfileBuilder motherName(String motherName) { this.motherName = motherName; return this; }
        public StudentProfileBuilder dob(LocalDate dob) { this.dob = dob; return this; }
        public StudentProfileBuilder gender(String gender) { this.gender = gender; return this; }
        public StudentProfileBuilder mobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; return this; }
        public StudentProfileBuilder whatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; return this; }
        public StudentProfileBuilder address(String address) { this.address = address; return this; }
        public StudentProfileBuilder city(String city) { this.city = city; return this; }
        public StudentProfileBuilder state(String state) { this.state = state; return this; }
        public StudentProfileBuilder pinCode(String pinCode) { this.pinCode = pinCode; return this; }
        public StudentProfileBuilder qualification(String qualification) { this.qualification = qualification; return this; }
        public StudentProfileBuilder collegeUniversity(String collegeUniversity) { this.collegeUniversity = collegeUniversity; return this; }
        public StudentProfileBuilder occupation(String occupation) { this.occupation = occupation; return this; }
        public StudentProfileBuilder profilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; return this; }

        public StudentProfile build() {
            StudentProfile p = new StudentProfile();
            p.id = this.id;
            p.user = this.user;
            p.fullName = this.fullName;
            p.fatherName = this.fatherName;
            p.motherName = this.motherName;
            p.dob = this.dob;
            p.gender = this.gender;
            p.mobileNumber = this.mobileNumber;
            p.whatsappNumber = this.whatsappNumber;
            p.address = this.address;
            p.city = this.city;
            p.state = this.state;
            p.pinCode = this.pinCode;
            p.qualification = this.qualification;
            p.collegeUniversity = this.collegeUniversity;
            p.occupation = this.occupation;
            p.profilePhotoUrl = this.profilePhotoUrl;
            return p;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getCollegeUniversity() { return collegeUniversity; }
    public void setCollegeUniversity(String collegeUniversity) { this.collegeUniversity = collegeUniversity; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
