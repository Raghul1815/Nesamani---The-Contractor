package com.nesamani.repository;

import com.nesamani.model.Application;
import com.nesamani.model.Job;
import com.nesamani.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /** All applications made by a worker */
    List<Application> findByWorkerOrderByAppliedAtDesc(User worker);

    /** All applications for a specific job (provider view) */
    List<Application> findByJobOrderByAppliedAtDesc(Job job);

    /** Check if worker already applied to a job */
    boolean existsByJobAndWorker(Job job, User worker);

    /** Find specific application */
    Optional<Application> findByJobAndWorker(Job job, User worker);

    /** Worker's applications with a specific status */
    List<Application> findByWorkerAndStatusOrderByAppliedAtDesc(
            User worker, Application.AppStatus status);

    /** Count applications for a job */
    long countByJob(Job job);
}
