-- ==========================================================
-- EduManage Full-Stack Enterprise Database Schema & Seed Data
-- ==========================================================

CREATE DATABASE IF NOT EXISTS edumanage_db;
USE edumanage_db;

-- 1. Users Table (Role-Based: ADMIN, STUDENT)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Student 16-Field Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    parent_name VARCHAR(150) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    passing_year VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    profile_photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description LONGTEXT,
    short_description VARCHAR(500),
    duration VARCHAR(50) NOT NULL,
    fees DECIMAL(10, 2) NOT NULL,
    level VARCHAR(50) DEFAULT 'Beginner to Advanced',
    thumbnail_url TEXT,
    syllabus LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Batches Table
CREATE TABLE IF NOT EXISTS batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    batch_name VARCHAR(150) NOT NULL,
    batch_code VARCHAR(50) NOT NULL UNIQUE,
    schedule_time VARCHAR(150),
    start_date DATE,
    end_date DATE,
    max_capacity INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. UPI Payment Verification Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    batch_id BIGINT,
    utr_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    screenshot_url TEXT,
    rejection_reason TEXT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Course Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    batch_id BIGINT,
    payment_id BIGINT,
    status ENUM('PENDING', 'APPROVED', 'ENROLLED', 'REJECTED') DEFAULT 'ENROLLED',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_course (student_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Video Lectures Table
CREATE TABLE IF NOT EXISTS video_lectures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration VARCHAR(50),
    order_index INT DEFAULT 1,
    is_free_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Study Notes & Resources Table
CREATE TABLE IF NOT EXISTS study_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) DEFAULT 'PDF',
    file_size_bytes BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description LONGTEXT NOT NULL,
    due_date DATE,
    max_marks INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Student Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submission_text LONGTEXT,
    attachment_url TEXT,
    obtained_marks INT,
    feedback TEXT,
    status ENUM('SUBMITTED', 'GRADED', 'REJECTED') DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Batch Discussion Chat Messages
CREATE TABLE IF NOT EXISTS batch_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Course Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================================
-- SEED DATA (Admin, Courses, Batches, Videos, Notes)
-- Default passwords are BCrypt hashes of 'admin123' and 'student123'
-- ==========================================================

-- Seed Admin User (admin@edumanage.com / admin123)
INSERT INTO users (id, full_name, email, password_hash, phone, role, is_active)
VALUES (
    1,
    'System Administrator',
    'admin@edumanage.com',
    '$2a$10$w8T0oMkWwZ3X72WJ2z2EKe1.bX7H7tqD0Kqf2RfxKqGsmf8E26xqa',
    '9876543210',
    'ADMIN',
    TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- Seed Sample Courses
INSERT INTO courses (id, title, category, description, short_description, duration, fees, level, thumbnail_url, syllabus, is_active)
VALUES 
(
    1,
    'Master Java Full Stack Engineering',
    'Full Stack',
    'End-to-end enterprise software development curriculum covering Java 21, Spring Boot 3, Hibernate JPA, REST APIs, Microservices, React.js, Tailwind CSS, Docker, and AWS Cloud Deployment.',
    'Master Java 21, Spring Boot 3, Microservices, React.js, and Cloud deployment from scratch.',
    '16 Weeks',
    24999.00,
    'Beginner to Advanced',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    'Module 1: Java 21 OOPS & Collections\nModule 2: Spring Boot 3 & Security\nModule 3: Relational DBs & MySQL\nModule 4: React 19 UI & Redux\nModule 5: Microservices & Docker',
    TRUE
),
(
    2,
    'Modern React & Next.js Frontend Architect',
    'Frontend',
    'Build blistering fast, interactive user interfaces with modern React, TypeScript, Tailwind CSS, Next.js App Router, SSR, and State Management architectures.',
    'Build production-grade web applications with modern React, TypeScript, and Tailwind CSS.',
    '12 Weeks',
    18999.00,
    'Intermediate',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    'Module 1: React Fundamentals & Hooks\nModule 2: State Management & Zustand\nModule 3: Tailwind CSS & Design Systems\nModule 4: Next.js 15 App Router & SSR',
    TRUE
),
(
    3,
    'Cloud DevOps & Kubernetes Masterclass',
    'Cloud',
    'Comprehensive DevOps engineering covering Linux administration, Docker containerization, Kubernetes orchestration, CI/CD pipelines with GitHub Actions, and AWS infrastructure.',
    'Deploy and scale resilient applications using Docker, Kubernetes, CI/CD, and AWS.',
    '14 Weeks',
    29999.00,
    'Advanced',
    'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80',
    'Module 1: Linux & Shell Scripting\nModule 2: Docker Containers & Compose\nModule 3: Kubernetes Clusters & Helm\nModule 4: CI/CD Pipelines with GitHub Actions\nModule 5: AWS Infrastructure & Terraform',
    TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- Seed Sample Batches
INSERT INTO batches (id, course_id, batch_name, batch_code, schedule_time, start_date, max_capacity, is_active)
VALUES
(1, 1, 'Alpha Java Cohort (Evening)', 'JAVA-2026-B1', 'Mon - Fri (7:00 PM - 9:00 PM IST)', '2026-08-15', 50, TRUE),
(2, 1, 'Weekend Java Fast-Track', 'JAVA-2026-W1', 'Sat & Sun (10:00 AM - 2:00 PM IST)', '2026-08-20', 40, TRUE),
(3, 2, 'React Frontend Cohort', 'REACT-2026-B1', 'Mon - Thu (8:00 PM - 9:30 PM IST)', '2026-08-18', 60, TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Video Lectures
INSERT INTO video_lectures (id, course_id, title, description, video_url, duration, order_index, is_free_preview)
VALUES
(1, 1, '01. Java 21 Modern Syntax & Virtual Threads', 'Deep dive into virtual threads and record patterns in Java 21.', 'https://www.youtube.com/watch?v=A74TOX803D0', '48 mins', 1, TRUE),
(2, 1, '02. Spring Boot 3.4 Architecture & Dependency Injection', 'Core principles of Inversion of Control and Bean lifecycle.', 'https://www.youtube.com/watch?v=9SGDpanrc8U', '54 mins', 2, FALSE),
(3, 1, '03. Building Secure REST APIs with Spring Security & JWT', 'Stateless authentication filter implementation walkthrough.', 'https://www.youtube.com/watch?v=bvpmhK8w2xY', '60 mins', 3, FALSE)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Study Notes
INSERT INTO study_notes (id, course_id, title, description, file_url, file_type)
VALUES
(1, 1, 'Spring Boot & JPA Architecture Cheatsheet', 'Complete reference guide for annotations, repositories, and entity mappings.', 'https://example.com/notes/spring_boot_cheatsheet.pdf', 'PDF'),
(2, 1, 'Java 21 Design Patterns & OOPS Guide', 'Structural and creational patterns with real-world enterprise examples.', 'https://example.com/notes/java_patterns.pdf', 'PDF')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Sample Assignments
INSERT INTO assignments (id, course_id, title, description, due_date, max_marks)
VALUES
(1, 1, 'Build a Secure JWT Authentication Microservice', 'Implement a standalone Spring Boot authentication service with role-based endpoint authorization.', '2026-08-30', 100)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Course Announcements
INSERT INTO announcements (id, course_id, title, content)
VALUES
(1, 1, 'Welcome to Master Java Full Stack Engineering!', 'Orientation call is scheduled this weekend. Make sure to download IntelliJ IDEA and Java 21 JDK before the first session.')
ON DUPLICATE KEY UPDATE id=id;
