package com.edumanage.service;

import com.edumanage.dto.request.BatchRequest;
import com.edumanage.entity.Batch;
import com.edumanage.entity.Course;
import com.edumanage.entity.Enrollment;
import com.edumanage.exception.ResourceNotFoundException;
import com.edumanage.repository.BatchRepository;
import com.edumanage.repository.CourseRepository;
import com.edumanage.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public BatchService(
            BatchRepository batchRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Batch> getBatchesByCourse(Long courseId) {
        return batchRepository.findByCourseId(courseId);
    }

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Batch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id: " + id));
    }

    @Transactional
    public Batch createBatch(BatchRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        Batch batch = Batch.builder()
                .course(course)
                .batchName(request.getBatchName())
                .batchCode(request.getBatchCode())
                .scheduleTime(request.getScheduleTime())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .maxCapacity(request.getMaxCapacity() != null ? request.getMaxCapacity() : 50)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return batchRepository.save(batch);
    }

    @Transactional
    public Batch updateBatch(Long id, BatchRequest request) {
        Batch batch = getBatchById(id);
        batch.setBatchName(request.getBatchName());
        batch.setBatchCode(request.getBatchCode());
        batch.setScheduleTime(request.getScheduleTime());
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());
        if (request.getMaxCapacity() != null) {
            batch.setMaxCapacity(request.getMaxCapacity());
        }
        if (request.getIsActive() != null) {
            batch.setIsActive(request.getIsActive());
        }
        return batchRepository.save(batch);
    }

    @Transactional
    public void deleteBatch(Long id) {
        Batch batch = getBatchById(id);
        batchRepository.delete(batch);
    }

    public List<Enrollment> getStudentsByBatch(Long batchId) {
        return enrollmentRepository.findByBatchId(batchId);
    }

    @Transactional
    public Enrollment assignStudentToBatch(Long enrollmentId, Long batchId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        Batch batch = getBatchById(batchId);
        enrollment.setBatch(batch);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment removeStudentFromBatch(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setBatch(null);
        return enrollmentRepository.save(enrollment);
    }
}
