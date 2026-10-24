package com.edumanage.config;

import com.edumanage.entity.*;
import com.edumanage.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final VideoRepository videoRepository;
    private final NoteRepository noteRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            CourseRepository courseRepository,
            BatchRepository batchRepository,
            VideoRepository videoRepository,
            NoteRepository noteRepository,
            AnnouncementRepository announcementRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.batchRepository = batchRepository;
        this.videoRepository = videoRepository;
        this.noteRepository = noteRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User if not exists
        if (!userRepository.existsByEmail("admin@edumanage.com")) {
            User admin = User.builder()
                    .email("admin@edumanage.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> [DataInitializer] Default Admin user initialized: admin@edumanage.com / admin123");
        }

        // 2. Seed Initial Intermediate STEM Courses if database is empty
        if (courseRepository.count() == 0) {
            // Course 1: Mathematics
            Course mathCourse = Course.builder()
                    .title("Class 11 & 12 Mathematics: Pure & Applied Masterclass")
                    .slug("class-11-12-mathematics-masterclass")
                    .category("Mathematics (+1 / +2)")
                    .shortDescription("Master Complete Class 11 & 12 Mathematics covering Calculus, Algebra, Coordinate Geometry, Vectors & Probability.")
                    .description("Comprehensive 2-Year Intermediate Mathematics curriculum designed for Class 11 (+1) & Class 12 (+2) students. Master NCERT foundations, State Board requirements, and high-yield problem-solving for JEE Main with chapter-wise DPPs and interactive live problem sessions.")
                    .duration("1 Year (Academic Session)")
                    .fees(new BigDecimal("14999.00"))
                    .level("Class 11 & 12 (Comprehensive)")
                    .thumbnailUrl("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80")
                    .syllabus("Chapter 1: Sets, Relations, Functions & Trigonometry\nChapter 2: Matrices, Determinants & Complex Numbers\nChapter 3: Limits, Continuity & Differential Calculus\nChapter 4: Integral Calculus & Differential Equations\nChapter 5: Vectors, 3D Geometry & Probability")
                    .isActive(true)
                    .build();
            mathCourse = courseRepository.save(mathCourse);

            // Course 2: Physics
            Course physicsCourse = Course.builder()
                    .title("Class 11 & 12 Physics: Conceptual Mastery & Numerical Problem Solving")
                    .slug("class-11-12-physics-masterclass")
                    .category("Physics (+1 / +2)")
                    .shortDescription("Mechanics, Thermodynamics, Electromagnetism, Optics & Modern Physics with real-world visual demonstrations.")
                    .description("In-depth physics program for +1 and +2 Intermediate students. Clear fundamental derivations, formula breakdowns, laboratory conceptualization, and numerical question solving for Board Exams and NEET/JEE entrance tests.")
                    .duration("1 Year (Academic Session)")
                    .fees(new BigDecimal("14999.00"))
                    .level("Class 11 & 12 (Comprehensive)")
                    .thumbnailUrl("https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80")
                    .syllabus("Chapter 1: Kinematics, Laws of Motion & Work-Energy\nChapter 2: Rotational Dynamics & Gravitation\nChapter 3: Thermodynamics & Kinetic Theory of Gases\nChapter 4: Electrostatics, Current Electricity & Magnetism\nChapter 5: Ray Optics, Wave Optics & Modern Physics")
                    .isActive(true)
                    .build();
            physicsCourse = courseRepository.save(physicsCourse);

            // Course 3: Chemistry
            Course chemCourse = Course.builder()
                    .title("Class 11 & 12 Chemistry: Organic, Inorganic & Physical Chemistry")
                    .slug("class-11-12-chemistry-masterclass")
                    .category("Chemistry (+1 / +2)")
                    .shortDescription("Complete NCERT line-by-line masterclass in Chemical Bonding, Organic Reaction Mechanisms & Physical Chemistry.")
                    .description("Master all three branches of Intermediate Chemistry (+1 & +2). Includes organic reaction mechanism roadmaps, periodic trends, equilibrium numericals, and board-level structured answer writing guides.")
                    .duration("1 Year (Academic Session)")
                    .fees(new BigDecimal("14999.00"))
                    .level("Class 11 & 12 (Comprehensive)")
                    .thumbnailUrl("https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80")
                    .syllabus("Chapter 1: Mole Concept, Atomic Structure & Periodic Table\nChapter 2: Chemical Bonding & Thermodynamics\nChapter 3: Chemical Equilibrium & Electrochemistry\nChapter 4: General Organic Chemistry (GOC) & Hydrocarbons\nChapter 5: Coordination Compounds & Biomolecules")
                    .isActive(true)
                    .build();
            chemCourse = courseRepository.save(chemCourse);

            // Course 4: Biology
            Course bioCourse = Course.builder()
                    .title("Class 11 & 12 Biology: Complete Botany & Zoology for NEET & Boards")
                    .slug("class-11-12-biology-masterclass")
                    .category("Biology (+1 / +2)")
                    .shortDescription("Target 360/360 in NEET and 100% in Intermediate BiPC Board with NCERT line-by-line diagram mastery.")
                    .description("Specialized Biology program for BiPC Intermediate (+1 and +2) and medical aspirants. Features high-definition anatomical diagrams, genetics punnett squares, plant physiology cycles, and high-yield question banks.")
                    .duration("1 Year (Academic Session)")
                    .fees(new BigDecimal("14999.00"))
                    .level("Class 11 & 12 (Comprehensive)")
                    .thumbnailUrl("https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80")
                    .syllabus("Chapter 1: Diversity in Living World & Plant Kingdom\nChapter 2: Cell Structure, Cell Cycle & Biomolecules\nChapter 3: Human Physiology & Plant Physiology\nChapter 4: Principles of Inheritance & Molecular Genetics\nChapter 5: Biotechnology & Ecology Ecosystems")
                    .isActive(true)
                    .build();
            bioCourse = courseRepository.save(bioCourse);

            // 3. Seed Sample Batches
            Batch b1 = Batch.builder()
                    .course(mathCourse)
                    .batchName("Aryabhata Maths Cohort (+1 & +2)")
                    .batchCode("MATH-2026-B1")
                    .scheduleTime("Mon, Wed, Fri (6:00 PM - 7:30 PM IST)")
                    .startDate(LocalDate.now().plusDays(5))
                    .endDate(LocalDate.now().plusWeeks(40))
                    .maxCapacity(60)
                    .isActive(true)
                    .build();
            batchRepository.save(b1);

            Batch b2 = Batch.builder()
                    .course(physicsCourse)
                    .batchName("Newton Physics Cohort (+1 & +2)")
                    .batchCode("PHYS-2026-B1")
                    .scheduleTime("Tue, Thu, Sat (6:00 PM - 7:30 PM IST)")
                    .startDate(LocalDate.now().plusDays(5))
                    .endDate(LocalDate.now().plusWeeks(40))
                    .maxCapacity(60)
                    .isActive(true)
                    .build();
            batchRepository.save(b2);

            Batch b3 = Batch.builder()
                    .course(chemCourse)
                    .batchName("Mendeleev Chemistry Cohort (+1 & +2)")
                    .batchCode("CHEM-2026-B1")
                    .scheduleTime("Mon, Wed, Fri (7:45 PM - 9:15 PM IST)")
                    .startDate(LocalDate.now().plusDays(5))
                    .endDate(LocalDate.now().plusWeeks(40))
                    .maxCapacity(60)
                    .isActive(true)
                    .build();
            batchRepository.save(b3);

            Batch b4 = Batch.builder()
                    .course(bioCourse)
                    .batchName("Darwin Biology Cohort (+1 & +2 BiPC)")
                    .batchCode("BIO-2026-B1")
                    .scheduleTime("Tue, Thu, Sat (7:45 PM - 9:15 PM IST)")
                    .startDate(LocalDate.now().plusDays(5))
                    .endDate(LocalDate.now().plusWeeks(40))
                    .maxCapacity(60)
                    .isActive(true)
                    .build();
            batchRepository.save(b4);

            // 4. Seed Video Lectures
            Video v1 = Video.builder()
                    .course(mathCourse)
                    .batch(b1)
                    .title("01. Differential Calculus: Limits & Continuity Foundations")
                    .description("Standard limits, L'Hopital rule, and continuity proofs for Class 11 and 12.")
                    .videoType("RECORDED")
                    .videoUrl("https://www.youtube.com/watch?v=EKvHQc3QEow")
                    .duration("52 mins")
                    .sequenceOrder(1)
                    .build();
            videoRepository.save(v1);

            Video v2 = Video.builder()
                    .course(physicsCourse)
                    .batch(b2)
                    .title("01. Laws of Motion & Free Body Diagrams (FBD)")
                    .description("Newton's three laws, friction analysis, and tension problems.")
                    .videoType("RECORDED")
                    .videoUrl("https://www.youtube.com/watch?v=kKKM8Y-u7ds")
                    .duration("58 mins")
                    .sequenceOrder(1)
                    .build();
            videoRepository.save(v2);

            // 5. Seed Study Notes
            Note note1 = Note.builder()
                    .course(mathCourse)
                    .batch(b1)
                    .title("Class 11 & 12 Maths Formula Handbook & Cheat Sheet")
                    .description("Complete calculus formulas, trigonometry identities, vectors & coordinate geometry quick reference.")
                    .fileUrl("https://example.com/notes/maths_formula_handbook.pdf")
                    .fileType("PDF")
                    .fileSize("3.8 MB")
                    .build();
            noteRepository.save(note1);

            Note note2 = Note.builder()
                    .course(physicsCourse)
                    .batch(b2)
                    .title("Physics Derivations & Unit Dimensions Summary")
                    .description("Top 50 high-frequency board derivations and standard numerical shortcuts.")
                    .fileUrl("https://example.com/notes/physics_derivations_guide.pdf")
                    .fileType("PDF")
                    .fileSize("4.2 MB")
                    .build();
            noteRepository.save(note2);

            // 6. Seed Announcements
            Announcement ann1 = Announcement.builder()
                    .course(mathCourse)
                    .batch(b1)
                    .title("Welcome to Intermediate (+1 / +2) Mathematics Masterclass!")
                    .content("Orientation session and syllabus roadmap will be discussed in our first live session. Download the NCERT PDF and Formula Sheet.")
                    .priority("HIGH")
                    .createdBy("Faculty of Mathematics")
                    .build();
            announcementRepository.save(ann1);

            System.out.println(">>> [DataInitializer] Intermediate (+1/+2) STEM Courses (Maths, Physics, Chemistry, Biology) initialized successfully!");
        }
    }
}
