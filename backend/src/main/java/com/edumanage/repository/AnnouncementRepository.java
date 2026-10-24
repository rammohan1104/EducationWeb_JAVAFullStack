package com.edumanage.repository;

import com.edumanage.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();

    @Query("SELECT a FROM Announcement a WHERE a.course.id = :courseId OR (a.batch.id = :batchId) OR (a.course IS NULL AND a.batch IS NULL) ORDER BY a.createdAt DESC")
    List<Announcement> findAnnouncementsForStudent(Long courseId, Long batchId);
}
