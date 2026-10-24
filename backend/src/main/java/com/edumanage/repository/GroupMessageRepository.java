package com.edumanage.repository;

import com.edumanage.entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    
    @Query("SELECT m FROM GroupMessage m JOIN FETCH m.user u LEFT JOIN FETCH u.profile WHERE m.batch.id = :batchId ORDER BY m.createdAt ASC")
    List<GroupMessage> findByBatchIdWithSender(Long batchId);
}
