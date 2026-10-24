package com.edumanage.dto.response;

import com.edumanage.entity.Role;
import com.edumanage.entity.StudentProfile;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private Role role;
    private String fullName;
    private String profilePhotoUrl;
    private StudentProfile profile;

    public AuthResponse() {}

    public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

    public static class AuthResponseBuilder {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private Role role;
        private String fullName;
        private String profilePhotoUrl;
        private StudentProfile profile;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder type(String type) { this.type = type; return this; }
        public AuthResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(Role role) { this.role = role; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder profilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; return this; }
        public AuthResponseBuilder profile(StudentProfile profile) { this.profile = profile; return this; }

        public AuthResponse build() {
            AuthResponse res = new AuthResponse();
            res.token = this.token;
            res.type = this.type != null ? this.type : "Bearer";
            res.id = this.id;
            res.email = this.email;
            res.role = this.role;
            res.fullName = this.fullName;
            res.profilePhotoUrl = this.profilePhotoUrl;
            res.profile = this.profile;
            return res;
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public StudentProfile getProfile() { return profile; }
    public void setProfile(StudentProfile profile) { this.profile = profile; }
}
