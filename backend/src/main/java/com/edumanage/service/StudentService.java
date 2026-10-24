package com.edumanage.service;

import com.edumanage.dto.request.StudentProfileUpdateRequest;
import com.edumanage.entity.*;
import com.edumanage.exception.ResourceNotFoundException;
import com.edumanage.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final EnrollmentRepository enrollmentRepository;

    public StudentService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<User> getAllStudents() {
        return userRepository.findAllStudentsWithProfile(Role.ROLE_STUDENT);
    }

    public User getStudentById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public StudentProfile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));
    }

    @Transactional
    public StudentProfile updateStudentProfile(Long userId, StudentProfileUpdateRequest request) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return StudentProfile.builder().user(user).build();
                });

        profile.setFullName(request.getFullName());
        profile.setFatherName(request.getFatherName());
        profile.setMotherName(request.getMotherName());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());
        profile.setMobileNumber(request.getMobileNumber());
        profile.setWhatsappNumber(request.getWhatsappNumber());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPinCode(request.getPinCode());
        profile.setQualification(request.getQualification());
        profile.setCollegeUniversity(request.getCollegeUniversity());
        profile.setOccupation(request.getOccupation());
        if (request.getProfilePhotoUrl() != null && !request.getProfilePhotoUrl().isBlank()) {
            profile.setProfilePhotoUrl(request.getProfilePhotoUrl());
        }

        return profileRepository.save(profile);
    }

    @Transactional
    public User toggleStudentStatus(Long userId) {
        User user = getStudentById(userId);
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        return userRepository.save(user);
    }

    @Transactional
    public void deleteStudent(Long userId) {
        User user = getStudentById(userId);
        userRepository.delete(user);
    }

    public List<Enrollment> getStudentEnrollments(Long userId) {
        return enrollmentRepository.findUserEnrollmentsWithDetails(userId);
    }
}
