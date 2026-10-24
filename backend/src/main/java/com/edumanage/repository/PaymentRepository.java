package com.edumanage.repository;

import com.edumanage.entity.Payment;
import com.edumanage.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);
    List<Payment> findAllByOrderByCreatedAtDesc();
    Optional<Payment> findByUtrNumber(String utrNumber);
    long countByStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'APPROVED'")
    BigDecimal calculateTotalApprovedRevenue();

    @Query("SELECT p FROM Payment p JOIN FETCH p.user u LEFT JOIN FETCH u.profile JOIN FETCH p.course c LEFT JOIN FETCH p.batch b ORDER BY p.createdAt DESC")
    List<Payment> findAllWithDetails();

    @Query("SELECT p FROM Payment p JOIN FETCH p.user u LEFT JOIN FETCH u.profile JOIN FETCH p.course c LEFT JOIN FETCH p.batch b WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<Payment> findUserPaymentsWithDetails(@Param("userId") Long userId);

    @Query("SELECT p FROM Payment p JOIN FETCH p.user u LEFT JOIN FETCH u.profile JOIN FETCH p.course c LEFT JOIN FETCH p.batch b WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Payment> findByStatusWithDetails(@Param("status") PaymentStatus status);
}
