package com.edumanage.repository;

import com.edumanage.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    List<AssignmentSubmission> findByUserId(Long userId);
    Optional<AssignmentSubmission> findByAssignmentIdAndUserId(Long assignmentId, Long userId);
}
