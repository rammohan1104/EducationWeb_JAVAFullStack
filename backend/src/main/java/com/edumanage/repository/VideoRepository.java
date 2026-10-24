package com.edumanage.repository;

import com.edumanage.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByCourseIdOrderBySequenceOrderAsc(Long courseId);
    List<Video> findByCourseIdAndBatchIdIsNullOrderBySequenceOrderAsc(Long courseId);
    List<Video> findByBatchIdOrderBySequenceOrderAsc(Long batchId);
}
