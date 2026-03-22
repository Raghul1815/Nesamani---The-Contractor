package com.nesamani.repository;

import com.nesamani.model.Application;
import com.nesamani.model.Job;
import com.nesamani.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    /** All jobs posted by a specific provider */
    List<Job> findByProviderOrderByCreatedAtDesc(User provider);

    /** All open jobs (for workers to browse) */
    List<Job> findByStatusOrderByCreatedAtDesc(Job.JobStatus status);

    /** Open jobs in a specific category */
    List<Job> findByStatusAndCategoryOrderByCreatedAtDesc(
            Job.JobStatus status, String category);

    /** Open jobs in a specific location */
    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')) " +
           "ORDER BY j.createdAt DESC")
    List<Job> findOpenJobsByLocation(String location);

    /** Open jobs by category and location */
    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND " +
           "LOWER(j.category) LIKE LOWER(CONCAT('%', :category, '%')) AND " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')) " +
           "ORDER BY j.createdAt DESC")
    List<Job> findOpenJobsByCategoryAndLocation(String category, String location);

    /** Jobs assigned to a specific worker */
    List<Job> findByWorkerOrderByCreatedAtDesc(User worker);

    /** Count active jobs for a provider */
    long countByProviderAndStatus(User provider, Job.JobStatus status);
}
