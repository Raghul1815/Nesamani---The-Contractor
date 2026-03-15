package com.nesamani.repository;

import com.nesamani.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find user by email — used during login */
    Optional<User> findByEmail(String email);

    /** Check if email already registered — used during registration */
    boolean existsByEmail(String email);

    /** Get all workers (for the "Find Workers" page) */
    List<User> findByRole(User.Role role);

    /** Get available workers in a specific category */
    List<User> findByRoleAndCategoryAndAvailability(
            User.Role role,
            String category,
            User.Availability availability);

    /** Search workers by location */
    @Query("SELECT u FROM User u WHERE u.role = 'WORKER' AND " +
           "LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<User> findWorkersByLocation(String location);

    /** Search workers by category and location */
    @Query("SELECT u FROM User u WHERE u.role = 'WORKER' AND " +
           "LOWER(u.category) LIKE LOWER(CONCAT('%', :category, '%')) AND " +
           "LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<User> findWorkersByCategoryAndLocation(String category, String location);
}
