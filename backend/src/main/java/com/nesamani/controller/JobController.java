package com.nesamani.controller;

import com.nesamani.dto.Dto;
import com.nesamani.model.Application;
import com.nesamani.model.Job;
import com.nesamani.model.User;
import com.nesamani.service.JobService;
import com.nesamani.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Job endpoints split by role:
 *
 * PUBLIC
 *   GET  /api/jobs/open              — browse open jobs (workers)
 *   GET  /api/workers                — browse all workers (providers)
 *
 * WORKER  (requires Bearer token, role = WORKER)
 *   GET  /api/worker/dashboard       — stats + recent data
 *   GET  /api/worker/jobs            — browse open jobs
 *   POST /api/worker/jobs/{id}/apply — apply to a job
 *   GET  /api/worker/applications    — my applications
 *   PUT  /api/worker/profile         — update profile
 *
 * PROVIDER  (requires Bearer token, role = PROVIDER)
 *   GET  /api/customer/dashboard     — stats + active jobs
 *   POST /api/customer/jobs          — post a new job
 *   GET  /api/customer/jobs          — my posted jobs
 *   PUT  /api/customer/jobs/{id}/status  — change job status
 *   DEL  /api/customer/jobs/{id}    — delete a job
 *   GET  /api/customer/jobs/{id}/applications  — applicants for a job
 *   PUT  /api/customer/applications/{id}/accept — accept applicant
 *   PUT  /api/customer/applications/{id}/reject — reject applicant
 *   PUT  /api/customer/profile       — update profile
 */
@RestController
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired private JobService  jobService;
    @Autowired private UserService userService;

    //  PUBLIC — no token needed
    // ════════════════════════════════════════════════════════════════════════

    /** Browse open jobs — optionally filter by category and/or location */
    @GetMapping("/api/jobs/open")
    public ResponseEntity<?> getOpenJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        List<Job> jobs = jobService.searchOpenJobs(category, location);
        return ResponseEntity.ok(jobs.stream().map(this::jobToMap).collect(Collectors.toList()));
    }

    /** Browse all workers — optionally filter by category and/or location */
    @GetMapping("/api/workers")
    public ResponseEntity<?> getWorkers(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        List<User> workers = userService.searchWorkers(category, location);
        return ResponseEntity.ok(workers.stream().map(this::workerToMap).collect(Collectors.toList()));
    }

    // ════════════════════════════════════════════════════════════════════════
    //  WORKER ROUTES  (/api/worker/**)
    // ════════════════════════════════════════════════════════════════════════

    /** Worker dashboard — stats + recent applications */
    @GetMapping("/api/worker/dashboard")
    public ResponseEntity<?> workerDashboard(Authentication auth) {
        String email = auth.getName();
        User   worker = userService.findByEmail(email);

        List<Application> myApps      = jobService.getWorkerApplications(email);
        List<Job>         openJobs    = jobService.getOpenJobs();
        long              accepted    = myApps.stream().filter(a -> a.getStatus() == Application.AppStatus.ACCEPTED).count();
        long              completed   = myApps.stream().filter(a -> a.getStatus() == Application.AppStatus.COMPLETED).count();

        Map<String, Object> data = new HashMap<>();
        data.put("name",         worker.getName());
        data.put("email",        worker.getEmail());
        data.put("rating",       worker.getRating());
        data.put("jobsCompleted",worker.getJobsCompleted());
        data.put("availability", worker.getAvailability());
        data.put("totalApplied", myApps.size());
        data.put("accepted",     accepted);
        data.put("completed",    completed);
        data.put("openJobsNearby", openJobs.size());
        data.put("recentApplications",
            myApps.stream().limit(5).map(this::appToMap).collect(Collectors.toList()));

        return ResponseEntity.ok(data);
    }

    /** Worker: browse open jobs (with optional filters) */
    @GetMapping("/api/worker/jobs")
    public ResponseEntity<?> workerBrowseJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        List<Job> jobs = jobService.searchOpenJobs(category, location);
        return ResponseEntity.ok(jobs.stream().map(this::jobToMap).collect(Collectors.toList()));
    }

    /** Worker: apply to a job */
    @PostMapping("/api/worker/jobs/{jobId}/apply")
    public ResponseEntity<?> applyToJob(
            @PathVariable Long jobId,
            @RequestBody(required = false) Dto.ApplyRequest req,
            Authentication auth) {
        try {
            Application app = jobService.applyToJob(jobId, auth.getName(), req);
            return ResponseEntity.ok(appToMap(app));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Worker: get all my applications */
    @GetMapping("/api/worker/applications")
    public ResponseEntity<?> myApplications(Authentication auth) {
        List<Application> apps = jobService.getWorkerApplications(auth.getName());
        return ResponseEntity.ok(apps.stream().map(this::appToMap).collect(Collectors.toList()));
    }

    /** Worker: update profile */
    @PutMapping("/api/worker/profile")
    public ResponseEntity<?> updateWorkerProfile(
            @RequestBody Dto.ProfileUpdateRequest req,
            Authentication auth) {
        try {
            User updated = userService.updateProfile(auth.getName(), req);
            return ResponseEntity.ok(workerToMap(updated));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    //  CUSTOMER / PROVIDER ROUTES  (/api/customer/**)
    // ════════════════════════════════════════════════════════════════════════

    /** Provider dashboard — stats + active jobs + available workers */
    @GetMapping("/api/customer/dashboard")
    public ResponseEntity<?> customerDashboard(Authentication auth) {
        String email    = auth.getName();
        User   provider = userService.findByEmail(email);

        List<Job>  myJobs    = jobService.getProviderJobs(email);
        List<User> workers   = userService.getAllWorkers();

        long active    = myJobs.stream().filter(j -> j.getStatus() == Job.JobStatus.ACTIVE).count();
        long completed = myJobs.stream().filter(j -> j.getStatus() == Job.JobStatus.COMPLETED).count();
        long pending   = myJobs.stream().filter(j -> j.getStatus() == Job.JobStatus.OPEN).count();

        Map<String, Object> data = new HashMap<>();
        data.put("name",       provider.getName());
        data.put("email",      provider.getEmail());
        data.put("totalJobs",  myJobs.size());
        data.put("active",     active);
        data.put("completed",  completed);
        data.put("pending",    pending);
        data.put("jobs",
            myJobs.stream().map(this::jobToMap).collect(Collectors.toList()));
        data.put("availableWorkers",
            workers.stream()
                   .filter(w -> w.getAvailability() == User.Availability.AVAILABLE)
                   .limit(8)
                   .map(this::workerToMap)
                   .collect(Collectors.toList()));

        return ResponseEntity.ok(data);
    }

    /** Provider: post a new job */
    @PostMapping("/api/customer/jobs")
    public ResponseEntity<?> postJob(
            @RequestBody Dto.JobRequest req,
            Authentication auth) {
        if (req.getTitle()    == null || req.getTitle().isBlank())    return error("Job title is required.",    HttpStatus.BAD_REQUEST);
        if (req.getCategory() == null || req.getCategory().isBlank()) return error("Category is required.",    HttpStatus.BAD_REQUEST);
        if (req.getLocation() == null || req.getLocation().isBlank()) return error("Location is required.",    HttpStatus.BAD_REQUEST);
        try {
            Job job = jobService.postJob(auth.getName(), req);
            return ResponseEntity.ok(jobToMap(job));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Provider: get all my posted jobs */
    @GetMapping("/api/customer/jobs")
    public ResponseEntity<?> getMyJobs(Authentication auth) {
        List<Job> jobs = jobService.getProviderJobs(auth.getName());
        return ResponseEntity.ok(jobs.stream().map(this::jobToMap).collect(Collectors.toList()));
    }

    /** Provider: update job status (OPEN → ACTIVE → COMPLETED / CANCELLED) */
    @PutMapping("/api/customer/jobs/{jobId}/status")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long jobId,
            @RequestParam String status,
            Authentication auth) {
        try {
            Job.JobStatus newStatus = Job.JobStatus.valueOf(status.toUpperCase());
            Job updated = jobService.updateJobStatus(jobId, auth.getName(), newStatus);
            return ResponseEntity.ok(jobToMap(updated));
        } catch (IllegalArgumentException e) {
            return error("Invalid status value: " + status, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Provider: delete a job */
    @DeleteMapping("/api/customer/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long jobId,
            Authentication auth) {
        try {
            jobService.deleteJob(jobId, auth.getName());
            return ResponseEntity.ok(new Dto.MessageResponse("Job deleted successfully."));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Provider: view all applications for one of my jobs */
    @GetMapping("/api/customer/jobs/{jobId}/applications")
    public ResponseEntity<?> getApplicationsForJob(
            @PathVariable Long jobId,
            Authentication auth) {
        try {
            List<Application> apps = jobService.getApplicationsForJob(jobId, auth.getName());
            return ResponseEntity.ok(apps.stream().map(this::appToMap).collect(Collectors.toList()));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Provider: accept an applicant */
    @PutMapping("/api/customer/applications/{appId}/accept")
    public ResponseEntity<?> acceptApplication(
            @PathVariable Long appId,
            Authentication auth) {
        try {
            Application app = jobService.respondToApplication(appId, auth.getName(), true);
            return ResponseEntity.ok(appToMap(app));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Provider: reject an applicant */
    @PutMapping("/api/customer/applications/{appId}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long appId,
            Authentication auth) {
        try {
            Application app = jobService.respondToApplication(appId, auth.getName(), false);
            return ResponseEntity.ok(appToMap(app));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Provider: update profile */
    @PutMapping("/api/customer/profile")
    public ResponseEntity<?> updateCustomerProfile(
            @RequestBody Dto.ProfileUpdateRequest req,
            Authentication auth) {
        try {
            User updated = userService.updateProfile(auth.getName(), req);
            return ResponseEntity.ok(Map.of(
                "name",     updated.getName(),
                "email",    updated.getEmail(),
                "phone",    updated.getPhone() != null ? updated.getPhone() : "",
                "location", updated.getLocation() != null ? updated.getLocation() : "",
                "bio",      updated.getBio() != null ? updated.getBio() : ""
            ));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    //  SERIALISATION HELPERS  (Job / User / Application → Map)
    //  These keep the JSON response clean without needing Jackson annotations.
    // ════════════════════════════════════════════════════════════════════════

    private Map<String, Object> jobToMap(Job j) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",          j.getId());
        m.put("title",       j.getTitle());
        m.put("category",    j.getCategory());
        m.put("location",    j.getLocation());
        m.put("budget",      j.getBudget() != null    ? j.getBudget()    : "");
        m.put("duration",    j.getDuration() != null  ? j.getDuration()  : "");
        m.put("description", j.getDescription() != null ? j.getDescription() : "");
        m.put("status",      j.getStatus().name().toLowerCase());
        m.put("date",        j.getCreatedAt() != null ? j.getCreatedAt().toLocalDate().toString() : "");
        m.put("expectedDate",j.getExpectedDate() != null ? j.getExpectedDate().toString() : "");
        m.put("icon",        categoryIcon(j.getCategory()));
        // provider summary (safe — no password)
        if (j.getProvider() != null) {
            m.put("providerName", j.getProvider().getName());
            m.put("providerId",  j.getProvider().getId());
        }
        // worker summary
        if (j.getWorker() != null) {
            m.put("workerName", j.getWorker().getName());
            m.put("workerId",   j.getWorker().getId());
        } else {
            m.put("workerName", "Searching…");
        }
        return m;
    }

    private Map<String, Object> workerToMap(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",           u.getId());
        m.put("name",         u.getName());
        m.put("email",        u.getEmail());
        m.put("phone",        u.getPhone() != null       ? u.getPhone()       : "");
        m.put("location",     u.getLocation() != null    ? u.getLocation()    : "");
        m.put("bio",          u.getBio() != null         ? u.getBio()         : "");
        m.put("category",     u.getCategory() != null    ? u.getCategory()    : "");
        m.put("rating",       u.getRating() != null      ? u.getRating()      : 0.0);
        m.put("jobsCompleted",u.getJobsCompleted() != null ? u.getJobsCompleted() : 0);
        m.put("availability", u.getAvailability() != null
                              ? u.getAvailability().name().toLowerCase() : "offline");
        m.put("icon",         categoryIcon(u.getCategory()));
        return m;
    }

    private Map<String, Object> appToMap(Application a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",          a.getId());
        m.put("status",      a.getStatus().name().toLowerCase());
        m.put("coverNote",   a.getCoverNote() != null    ? a.getCoverNote()    : "");
        m.put("quotedPrice", a.getQuotedPrice() != null  ? a.getQuotedPrice()  : "");
        m.put("appliedAt",   a.getAppliedAt() != null    ? a.getAppliedAt().toLocalDate().toString() : "");
        // embed job summary
        if (a.getJob() != null) {
            m.put("jobId",       a.getJob().getId());
            m.put("jobTitle",    a.getJob().getTitle());
            m.put("jobCategory", a.getJob().getCategory());
            m.put("jobLocation", a.getJob().getLocation());
            m.put("jobBudget",   a.getJob().getBudget() != null ? a.getJob().getBudget() : "");
            m.put("icon",        categoryIcon(a.getJob().getCategory()));
            if (a.getJob().getProvider() != null) {
                m.put("customer",    a.getJob().getProvider().getName());
                m.put("customerId",  a.getJob().getProvider().getId());
            }
        }
        // embed worker summary
        if (a.getWorker() != null) {
            m.put("workerName",  a.getWorker().getName());
            m.put("workerId",    a.getWorker().getId());
            m.put("workerRating",a.getWorker().getRating() != null ? a.getWorker().getRating() : 0.0);
        }
        return m;
    }

    private String categoryIcon(String category) {
        if (category == null) return "🛠️";
        return switch (category.toLowerCase()) {
            case "plumbing"         -> "🔧";
            case "electrical"       -> "⚡";
            case "painting"         -> "🎨";
            case "driving"          -> "🚗";
            case "maid / cleaning",
                 "maid"             -> "🏠";
            case "carpentry"        -> "🪵";
            case "gardening"        -> "🌿";
            case "cooking"          -> "🍳";
            default                 -> "🛠️";
        };
    }

    // ── Error helper ─────────────────────────────────────────────────────────
    private ResponseEntity<Dto.ErrorResponse> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new Dto.ErrorResponse(message, status.value()));
    }
}
