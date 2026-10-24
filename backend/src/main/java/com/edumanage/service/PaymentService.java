package com.edumanage.service;

import com.edumanage.dto.request.PaymentSubmitRequest;
import com.edumanage.dto.request.PaymentVerifyRequest;
import com.edumanage.entity.*;
import com.edumanage.exception.BadRequestException;
import com.edumanage.exception.ResourceNotFoundException;
import com.edumanage.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            CourseRepository courseRepository,
            BatchRepository batchRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.batchRepository = batchRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public Payment submitPayment(Long userId, PaymentSubmitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Batch batch = null;
        if (request.getBatchId() != null) {
            batch = batchRepository.findById(request.getBatchId()).orElse(null);
        }

        Optional<Payment> existing = paymentRepository.findByUtrNumber(request.getUtrNumber().trim());
        if (existing.isPresent()) {
            throw new BadRequestException("This Transaction / UTR number has already been submitted: " + request.getUtrNumber());
        }

        Payment payment = Payment.builder()
                .user(user)
                .course(course)
                .batch(batch)
                .amount(request.getAmount())
                .utrNumber(request.getUtrNumber().trim())
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now())
                .screenshotUrl(request.getScreenshotUrl())
                .upiId(request.getUpiId())
                .status(PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        Optional<Enrollment> optEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, course.getId());
        if (optEnrollment.isEmpty()) {
            Enrollment enrollment = Enrollment.builder()
                    .user(user)
                    .course(course)
                    .batch(batch)
                    .status(EnrollmentStatus.PENDING)
                    .build();
            enrollmentRepository.save(enrollment);
        } else {
            Enrollment enrollment = optEnrollment.get();
            if (enrollment.getStatus() != EnrollmentStatus.ENROLLED) {
                enrollment.setStatus(EnrollmentStatus.PENDING);
                if (batch != null) {
                    enrollment.setBatch(batch);
                }
                enrollmentRepository.save(enrollment);
            }
        }

        return savedPayment;
    }

    @Transactional
    public Payment verifyPayment(Long paymentId, Long adminId, PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found with id: " + paymentId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        payment.setStatus(request.getStatus());
        payment.setVerifiedBy(admin);
        payment.setVerifiedAt(LocalDateTime.now());

        if (request.getStatus() == PaymentStatus.REJECTED) {
            payment.setRejectionReason(request.getRejectionReason() != null ? request.getRejectionReason() : "Payment details could not be verified.");
            Optional<Enrollment> optEnrollment = enrollmentRepository.findByUserIdAndCourseId(payment.getUser().getId(), payment.getCourse().getId());
            optEnrollment.ifPresent(enrollment -> {
                if (enrollment.getStatus() == EnrollmentStatus.PENDING) {
                    enrollment.setStatus(EnrollmentStatus.CANCELLED);
                    enrollmentRepository.save(enrollment);
                }
            });
        } else if (request.getStatus() == PaymentStatus.APPROVED) {
            payment.setRejectionReason(null);

            Batch targetBatch = payment.getBatch();
            if (request.getBatchId() != null) {
                targetBatch = batchRepository.findById(request.getBatchId()).orElse(targetBatch);
            }
            if (targetBatch == null) {
                List<Batch> activeBatches = batchRepository.findByCourseIdAndIsActiveTrue(payment.getCourse().getId());
                if (!activeBatches.isEmpty()) {
                    targetBatch = activeBatches.get(0);
                }
            }

            Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(payment.getUser().getId(), payment.getCourse().getId())
                    .orElseGet(() -> Enrollment.builder()
                            .user(payment.getUser())
                            .course(payment.getCourse())
                            .build());

            enrollment.setStatus(EnrollmentStatus.ENROLLED);
            enrollment.setEnrolledAt(LocalDateTime.now());
            enrollment.setBatch(targetBatch);
            enrollmentRepository.save(enrollment);
        }

        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllWithDetails();
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatusWithDetails(status);
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findUserPaymentsWithDetails(userId);
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }
}
