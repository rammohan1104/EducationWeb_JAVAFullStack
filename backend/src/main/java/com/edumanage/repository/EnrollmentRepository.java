package com.edumanage.repository;

import com.edumanage.entity.Enrollment;
import com.edumanage.entity.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByCourseId(Long courseId);
    List<Enrollment> findByBatchId(Long batchId);
    List<Enrollment> findByStatus(EnrollmentStatus status);
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    long countByStatus(EnrollmentStatus status);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.user u JOIN FETCH e.course c LEFT JOIN FETCH e.batch b WHERE e.user.id = :userId")
    List<Enrollment> findUserEnrollmentsWithDetails(Long userId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.user u LEFT JOIN FETCH u.profile JOIN FETCH e.course c LEFT JOIN FETCH e.batch b")
    List<Enrollment> findAllWithDetails();
}
