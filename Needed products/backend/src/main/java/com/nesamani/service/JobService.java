package com.nesamani.service;

import com.nesamani.dto.Dto;
import com.nesamani.model.Application;
import com.nesamani.model.Job;
import com.nesamani.model.User;
import com.nesamani.repository.ApplicationRepository;
import com.nesamani.repository.JobRepository;
import com.nesamani.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobService {

    @Autowired private JobRepository        jobRepository;
    @Autowired private ApplicationRepository appRepository;
    @Autowired private UserRepository       userRepository;

    // ── Provider: Post a job ──────────────────────────────────────────────────

    public Job postJob(String providerEmail, Dto.JobRequest req) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("Provider not found."));

        if (provider.getRole() != User.Role.PROVIDER) {
            throw new RuntimeException("Only service providers can post jobs.");
        }

        Job job = new Job();
        job.setTitle(req.getTitle().trim());
        job.setCategory(req.getCategory());
        job.setLocation(req.getLocation().trim());
        job.setBudget(req.getBudget());
        job.setDuration(req.getDuration());
        job.setDescription(req.getDescription());
        job.setStatus(Job.JobStatus.OPEN);
        job.setProvider(provider);

        if (req.getDate() != null && !req.getDate().isBlank()) {
            try { job.setExpectedDate(LocalDate.parse(req.getDate())); }
            catch (Exception ignored) { /* invalid date — skip */ }
        }

        return jobRepository.save(job);
    }

    // ── Provider: Get my jobs ─────────────────────────────────────────────────

    public List<Job> getProviderJobs(String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("Provider not found."));
        return jobRepository.findByProviderOrderByCreatedAtDesc(provider);
    }

    public Job updateJobStatus(Long jobId, String providerEmail, Job.JobStatus newStatus) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        if (!job.getProvider().getEmail().equals(providerEmail)) {
            throw new RuntimeException("You do not own this job.");
        }

        job.setStatus(newStatus);
        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, String providerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        if (!job.getProvider().getEmail().equals(providerEmail)) {
            throw new RuntimeException("You do not own this job.");
        }

        jobRepository.delete(job);
    }

    // ── Worker: Browse open jobs ──────────────────────────────────────────────

    public List<Job> getOpenJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc(Job.JobStatus.OPEN);
    }

    public List<Job> searchOpenJobs(String category, String location) {
        if (category != null && !category.isBlank() && location != null && !location.isBlank()) {
            return jobRepository.findOpenJobsByCategoryAndLocation(category, location);
        } else if (location != null && !location.isBlank()) {
            return jobRepository.findOpenJobsByLocation(location);
        } else if (category != null && !category.isBlank()) {
            return jobRepository.findByStatusAndCategoryOrderByCreatedAtDesc(Job.JobStatus.OPEN, category);
        }
        return getOpenJobs();
    }

    // ── Worker: Apply to a job ────────────────────────────────────────────────

    public Application applyToJob(Long jobId, String workerEmail, Dto.ApplyRequest req) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found."));

        if (worker.getRole() != User.Role.WORKER) {
            throw new RuntimeException("Only workers can apply to jobs.");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new RuntimeException("This job is no longer accepting applications.");
        }

        if (appRepository.existsByJobAndWorker(job, worker)) {
            throw new RuntimeException("You have already applied to this job.");
        }

        Application app = new Application(job, worker);
        if (req != null) {
            app.setCoverNote(req.getCoverNote());
            app.setQuotedPrice(req.getQuotedPrice());
        }

        return appRepository.save(app);
    }

    // ── Worker: My applications ───────────────────────────────────────────────

    public List<Application> getWorkerApplications(String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found."));
        return appRepository.findByWorkerOrderByAppliedAtDesc(worker);
    }

    // ── Provider: Accept / reject an application ──────────────────────────────

    public Application respondToApplication(Long appId, String providerEmail, boolean accept) {
        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found."));

        Job job = app.getJob();
        if (!job.getProvider().getEmail().equals(providerEmail)) {
            throw new RuntimeException("You do not own this job.");
        }

        if (accept) {
            app.setStatus(Application.AppStatus.ACCEPTED);
            job.setStatus(Job.JobStatus.ACTIVE);
            job.setWorker(app.getWorker());
            jobRepository.save(job);
        } else {
            app.setStatus(Application.AppStatus.REJECTED);
        }

        return appRepository.save(app);
    }

    // ── Provider: Get applications for my job ─────────────────────────────────

    public List<Application> getApplicationsForJob(Long jobId, String providerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        if (!job.getProvider().getEmail().equals(providerEmail)) {
            throw new RuntimeException("You do not own this job.");
        }

        return appRepository.findByJobOrderByAppliedAtDesc(job);
    }
}
