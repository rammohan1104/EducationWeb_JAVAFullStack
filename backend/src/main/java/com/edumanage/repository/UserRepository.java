package com.edumanage.repository;

import com.edumanage.entity.Role;
import com.edumanage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    long countByRoleAndIsActive(Role role, Boolean isActive);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile WHERE u.role = :role")
    List<User> findAllStudentsWithProfile(Role role);
}
