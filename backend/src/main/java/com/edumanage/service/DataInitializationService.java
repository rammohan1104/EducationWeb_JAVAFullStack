package com.edumanage.service;

import com.edumanage.entity.*;
import com.edumanage.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializationService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializationService.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final VideoRepository videoRepository;
    private final NoteRepository noteRepository;
    private final AnnouncementRepository announcementRepository;
    private final AssignmentRepository assignmentRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializationService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            CourseRepository courseRepository,
            BatchRepository batchRepository,
            EnrollmentRepository enrollmentRepository,
            PaymentRepository paymentRepository,
            VideoRepository videoRepository,
            NoteRepository noteRepository,
            AnnouncementRepository announcementRepository,
            AssignmentRepository assignmentRepository,
            GroupMessageRepository groupMessageRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.courseRepository = courseRepository;
        this.batchRepository = batchRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.paymentRepository = paymentRepository;
        this.videoRepository = videoRepository;
        this.noteRepository = noteRepository;
        this.announcementRepository = announcementRepository;
        this.assignmentRepository = assignmentRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data load.");
            return;
        }

        log.info("Seeding initial database data...");

        // 1. Create Admin
        User admin = User.builder()
                .email("admin@edumanage.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ROLE_ADMIN)
                .isActive(true)
                .build();
        admin = userRepository.save(admin);

        // 2. Create Demo Student with all 16 profile fields
        User student = User.builder()
                .email("student@edumanage.com")
                .password(passwordEncoder.encode("student123"))
                .role(Role.ROLE_STUDENT)
                .isActive(true)
                .build();
        student = userRepository.save(student);

        StudentProfile studentProfile = StudentProfile.builder()
                .user(student)
                .fullName("Rahul Sharma")
                .fatherName("Rajesh Sharma")
                .motherName("Sunita Sharma")
                .dob(LocalDate.of(2001, 5, 14))
                .gender("Male")
                .mobileNumber("+91 9876543210")
                .whatsappNumber("+91 9876543210")
                .address("Flat 402, Green Valley Apartments, Silicon City Road")
                .city("Bengaluru")
                .state("Karnataka")
                .pinCode("560100")
                .qualification("B.Tech in Computer Science")
                .collegeUniversity("VTU Institute of Technology")
                .occupation("Software Trainee")
                .profilePhotoUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80")
                .build();
        profileRepository.save(studentProfile);

        // Another Student
        User student2 = User.builder()
                .email("priya.patel@gmail.com")
                .password(passwordEncoder.encode("student123"))
                .role(Role.ROLE_STUDENT)
                .isActive(true)
                .build();
        student2 = userRepository.save(student2);

        StudentProfile profile2 = StudentProfile.builder()
                .user(student2)
                .fullName("Priya Patel")
                .fatherName("Suresh Patel")
                .motherName("Meena Patel")
                .dob(LocalDate.of(2002, 9, 21))
                .gender("Female")
                .mobileNumber("+91 9811223344")
                .whatsappNumber("+91 9811223344")
                .address("B-12, Heritage Heights, Satellite")
                .city("Ahmedabad")
                .state("Gujarat")
                .pinCode("380015")
                .qualification("MCA")
                .collegeUniversity("Gujarat Technological University")
                .occupation("Student")
                .profilePhotoUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80")
                .build();
        profileRepository.save(profile2);

        // 3. Create Courses
        Course course1 = Course.builder()
                .title("Java Full Stack Development")
                .slug("java-full-stack-development")
                .shortDescription("Master modern Java, Spring Boot 3, Microservices, Hibernate, REST APIs and React 18 frontend.")
                .description("Comprehensive job-ready curriculum covering Core Java, Collections, Multithreading, Spring Core, Spring Boot, Spring Security, JPA Hibernate, Docker, Kubernetes, AWS Deployment, and React.js frontend integration with real-world capstone projects.")
                .duration("6 Months")
                .fees(BigDecimal.valueOf(24999.00))
                .category("Full Stack")
                .level("All Levels")
                .thumbnailUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80")
                .syllabus("Module 1: Core Java & OOP Concepts\nModule 2: Collections & Concurrency\nModule 3: Spring Boot 3 & RESTful Web Services\nModule 4: Spring Security 6 & JWT Auth\nModule 5: Hibernate & MySQL Optimization\nModule 6: React Frontend & State Management\nModule 7: Cloud Deployment & CI/CD Pipeline")
                .isActive(true)
                .build();
        course1 = courseRepository.save(course1);

        Course course2 = Course.builder()
                .title("Modern React & Frontend Engineering")
                .slug("modern-react-frontend-engineering")
                .shortDescription("Build high-performance, responsive web applications with React 18, Next.js, Redux Toolkit, and Tailwind CSS.")
                .description("In-depth frontend development program with React Hooks, Context API, state management, Tailwind CSS, TypeScript, Server-Side Rendering (SSR), REST/GraphQL API integration, and web performance optimization.")
                .duration("3 Months")
                .fees(BigDecimal.valueOf(16999.00))
                .category("Frontend")
                .level("Intermediate")
                .thumbnailUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80")
                .syllabus("Module 1: Modern JavaScript ES6+\nModule 2: React Fundamentals & Hooks\nModule 3: Tailwind CSS & Responsive Design\nModule 4: Redux Toolkit & State Architecture\nModule 5: Next.js & Server Components\nModule 6: Enterprise Portfolio Projects")
                .isActive(true)
                .build();
        course2 = courseRepository.save(course2);

        Course course3 = Course.builder()
                .title("Python & AI Full Stack Masterclass")
                .slug("python-ai-full-stack-masterclass")
                .shortDescription("Complete Python programming, FastAPI, Django, PostgreSQL, Generative AI integration, and React UI.")
                .description("Learn end-to-end Python backend engineering, LangChain, LLM application development, FastAPI REST backends, and full-stack deployment.")
                .duration("5 Months")
                .fees(BigDecimal.valueOf(21999.00))
                .category("Full Stack")
                .level("Beginner to Advanced")
                .thumbnailUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80")
                .syllabus("Module 1: Python Core & Data Structures\nModule 2: FastAPI & Async Programming\nModule 3: PostgreSQL & ORMs\nModule 4: LangChain & OpenAI API Integration\nModule 5: Full-Stack React Integration\nModule 6: Cloud Deployment on AWS")
                .isActive(true)
                .build();
        course3 = courseRepository.save(course3);

        // 4. Create Batches
        Batch batch1A = Batch.builder()
                .course(course1)
                .batchName("Batch A - Regular")
                .batchCode("JAVA-2026-A")
                .scheduleTime("Mon-Fri 7:00 PM - 9:00 PM IST")
                .startDate(LocalDate.now().minusDays(15))
                .endDate(LocalDate.now().plusMonths(5))
                .maxCapacity(50)
                .isActive(true)
                .build();
        batch1A = batchRepository.save(batch1A);

        Batch batch1B = Batch.builder()
                .course(course1)
                .batchName("Batch B - Fast Track")
                .batchCode("JAVA-2026-B")
                .scheduleTime("Mon-Sat 10:00 AM - 1:00 PM IST")
                .startDate(LocalDate.now().plusDays(5))
                .endDate(LocalDate.now().plusMonths(4))
                .maxCapacity(40)
                .isActive(true)
                .build();
        batchRepository.save(batch1B);

        Batch batch1C = Batch.builder()
                .course(course1)
                .batchName("Batch C - Weekend Special")
                .batchCode("JAVA-2026-C")
                .scheduleTime("Sat-Sun 9:00 AM - 2:00 PM IST")
                .startDate(LocalDate.now().plusDays(12))
                .endDate(LocalDate.now().plusMonths(6))
                .maxCapacity(60)
                .isActive(true)
                .build();
        batchRepository.save(batch1C);

        Batch batch2M = Batch.builder()
                .course(course2)
                .batchName("Morning Batch")
                .batchCode("REACT-2026-M")
                .scheduleTime("Mon-Fri 8:00 AM - 10:00 AM IST")
                .startDate(LocalDate.now().minusDays(10))
                .endDate(LocalDate.now().plusMonths(3))
                .maxCapacity(45)
                .isActive(true)
                .build();
        batch2M = batchRepository.save(batch2M);

        Batch batch2E = Batch.builder()
                .course(course2)
                .batchName("Evening Batch")
                .batchCode("REACT-2026-E")
                .scheduleTime("Mon-Fri 8:00 PM - 10:00 PM IST")
                .startDate(LocalDate.now().plusDays(7))
                .endDate(LocalDate.now().plusMonths(3))
                .maxCapacity(45)
                .isActive(true)
                .build();
        batch2E = batchRepository.save(batch2E);

        Batch batch3W = Batch.builder()
                .course(course3)
                .batchName("Weekend Batch")
                .batchCode("PYTHON-2026-W")
                .scheduleTime("Sat-Sun 10:00 AM - 3:00 PM IST")
                .startDate(LocalDate.now().plusDays(14))
                .endDate(LocalDate.now().plusMonths(5))
                .maxCapacity(50)
                .isActive(true)
                .build();
        batch3W = batchRepository.save(batch3W);

        // 5. Enroll Student 1 in Course 1 Batch A (Approved & Enrolled)
        Enrollment enrollment1 = Enrollment.builder()
                .user(student)
                .course(course1)
                .batch(batch1A)
                .status(EnrollmentStatus.ENROLLED)
                .enrolledAt(LocalDateTime.now().minusDays(14))
                .certificateIssued(false)
                .build();
        enrollmentRepository.save(enrollment1);

        Payment payment1 = Payment.builder()
                .user(student)
                .course(course1)
                .batch(batch1A)
                .amount(BigDecimal.valueOf(24999.00))
                .utrNumber("UTR482910482910")
                .paymentDate(LocalDate.now().minusDays(15))
                .upiId("admin@edumanage.upi")
                .status(PaymentStatus.APPROVED)
                .verifiedBy(admin)
                .verifiedAt(LocalDateTime.now().minusDays(14))
                .build();
        paymentRepository.save(payment1);

        // Student 2 Pending Payment in Course 2
        Enrollment enrollment2 = Enrollment.builder()
                .user(student2)
                .course(course2)
                .batch(batch2M)
                .status(EnrollmentStatus.PENDING)
                .build();
        enrollmentRepository.save(enrollment2);

        Payment payment2 = Payment.builder()
                .user(student2)
                .course(course2)
                .batch(batch2M)
                .amount(BigDecimal.valueOf(16999.00))
                .utrNumber("UTR981726354421")
                .paymentDate(LocalDate.now().minusDays(1))
                .upiId("admin@edumanage.upi")
                .status(PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment2);

        // 6. Create Sample Videos
        Video video1 = Video.builder()
                .course(course1)
                .batch(batch1A)
                .title("Lecture 01: Course Overview & Java 21 LTS Features")
                .description("Introduction to JVM architecture, JRE, JDK, bytecode execution, and Java modern features.")
                .videoType("YOUTUBE")
                .videoUrl("https://www.youtube.com/watch?v=eIrMbAQSU34")
                .duration("52 mins")
                .sequenceOrder(1)
                .build();
        videoRepository.save(video1);

        Video video2 = Video.builder()
                .course(course1)
                .batch(batch1A)
                .title("Lecture 02: Object Oriented Design & Clean Code")
                .description("Deep dive into Inheritance, Polymorphism, Abstraction, Interfaces, and SOLID design principles.")
                .videoType("YOUTUBE")
                .videoUrl("https://www.youtube.com/watch?v=eIrMbAQSU34")
                .duration("1 hour 15 mins")
                .sequenceOrder(2)
                .build();
        videoRepository.save(video2);

        Video video3 = Video.builder()
                .course(course1)
                .batch(batch1A)
                .title("Live Doubt Clearance & Q&A Session")
                .description("Live interactive doubt solving session on Spring Boot Dependency Injection.")
                .videoType("LIVE")
                .videoUrl("https://meet.google.com/abc-defg-hij")
                .duration("1 hour")
                .sequenceOrder(3)
                .build();
        videoRepository.save(video3);

        // 7. Create Sample Notes
        Note note1 = Note.builder()
                .course(course1)
                .batch(batch1A)
                .title("Module 1 - Java Core Architecture & OOP CheatSheet")
                .description("Comprehensive summary notes covering memory management, heap vs stack, and garbage collection.")
                .fileUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                .fileType("PDF")
                .fileSize("3.2 MB")
                .build();
        noteRepository.save(note1);

        Note note2 = Note.builder()
                .course(course1)
                .batch(batch1A)
                .title("Spring Boot 3 & Security Complete Reference Guide")
                .description("Handy reference guide for Spring Security Filter Chain, JWT architecture, and JPA relationships.")
                .fileUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                .fileType("PDF")
                .fileSize("5.8 MB")
                .build();
        noteRepository.save(note2);

        Note note3 = Note.builder()
                .course(course1)
                .batch(batch1A)
                .title("Database Schema Design & SQL Scripts (ZIP)")
                .description("ZIP archive containing sample database dump and normalization exercises.")
                .fileUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                .fileType("ZIP")
                .fileSize("8.1 MB")
                .build();
        noteRepository.save(note3);

        // 8. Create Sample Announcements
        Announcement ann1 = Announcement.builder()
                .course(course1)
                .batch(batch1A)
                .title("Live Workshop: Building Microservices with Spring Cloud on Saturday")
                .content("Dear Students, We will be hosting an exclusive 3-hour live workshop on Spring Cloud Gateway, Eureka Server, and OpenFeign this Saturday at 11:00 AM IST. Please review the Module 3 notes beforehand.")
                .priority("URGENT")
                .createdBy("Admin / Faculty Lead")
                .build();
        announcementRepository.save(ann1);

        Announcement ann2 = Announcement.builder()
                .course(course1)
                .batch(batch1A)
                .title("Assignment 1 Submission Deadline Extended")
                .content("The deadline for Assignment 1 (Spring Security JWT Implementation) has been extended by 3 days. Please submit before Sunday midnight.")
                .priority("NORMAL")
                .createdBy("Admin")
                .build();
        announcementRepository.save(ann2);

        // 9. Create Sample Assignments
        Assignment assign1 = Assignment.builder()
                .course(course1)
                .batch(batch1A)
                .title("Assignment 1: Build RESTful CRUD with Spring Data JPA")
                .description("Develop a full CRUD REST API for a Product Catalog with pagination, sorting, and validation. Submit your GitHub repository link or ZIP file.")
                .dueDate(LocalDate.now().plusDays(5))
                .maxScore(100)
                .build();
        assignmentRepository.save(assign1);

        // 10. Sample Group Messages in Batch 1A
        GroupMessage gm1 = GroupMessage.builder()
                .batch(batch1A)
                .user(admin)
                .message("Welcome everyone to Java Full Stack Batch A! Feel free to ask any doubts or share your project progress here.")
                .isAnnouncement(true)
                .build();
        groupMessageRepository.save(gm1);

        GroupMessage gm2 = GroupMessage.builder()
                .batch(batch1A)
                .user(student)
                .message("Hello sir! Excited to be part of the batch. In lecture 2, could you share the slide deck on SOLID design principles?")
                .isAnnouncement(false)
                .build();
        groupMessageRepository.save(gm2);

        log.info("Database seeding completed successfully.");
    }
}
