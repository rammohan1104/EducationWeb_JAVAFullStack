package com.edumanage.service;

import com.edumanage.dto.request.ChangePasswordRequest;
import com.edumanage.dto.request.LoginRequest;
import com.edumanage.dto.request.StudentRegisterRequest;
import com.edumanage.dto.response.AuthResponse;
import com.edumanage.entity.Role;
import com.edumanage.entity.StudentProfile;
import com.edumanage.entity.User;
import com.edumanage.exception.BadRequestException;
import com.edumanage.exception.ResourceNotFoundException;
import com.edumanage.repository.StudentProfileRepository;
import com.edumanage.repository.UserRepository;
import com.edumanage.security.JwtUtils;
import com.edumanage.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_STUDENT)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .fullName(request.getFullName())
                .fatherName(request.getFatherName())
                .motherName(request.getMotherName())
                .dob(request.getDob())
                .gender(request.getGender())
                .mobileNumber(request.getMobileNumber())
                .whatsappNumber(request.getWhatsappNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pinCode(request.getPinCode())
                .qualification(request.getQualification())
                .collegeUniversity(request.getCollegeUniversity())
                .occupation(request.getOccupation())
                .profilePhotoUrl(request.getProfilePhotoUrl())
                .build();

        profile = profileRepository.save(profile);
        user.setProfile(profile);

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String jwt = jwtUtils.generateToken(userDetails, profile.getFullName());

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(profile.getFullName())
                .profilePhotoUrl(profile.getProfilePhotoUrl())
                .profile(profile)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("Your account is deactivated or suspended. Please contact admin.");
        }

        String fullName = user.getProfile() != null ? user.getProfile().getFullName() : (user.getRole() == Role.ROLE_ADMIN ? "System Admin" : user.getEmail());
        String photoUrl = user.getProfile() != null ? user.getProfile().getProfilePhotoUrl() : null;

        String jwt = jwtUtils.generateToken(userDetails, fullName);

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(fullName)
                .profilePhotoUrl(photoUrl)
                .profile(user.getProfile())
                .build();
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with email: " + email));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
