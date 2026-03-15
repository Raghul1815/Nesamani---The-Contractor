package com.nesamani.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * A worker's application to a posted job.
 * Created when a worker clicks "Apply" on a job listing.
 */
@Entity
@Table(name = "applications",
       uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "worker_id"}))
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The job being applied to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // The worker applying
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    @Column(columnDefinition = "TEXT")
    private String coverNote;   // Optional message from worker

    private String quotedPrice; // Worker's price quote

    @Enumerated(EnumType.STRING)
    private AppStatus status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime appliedAt;

    // ── Status Enum ──────────────────────────────

    public enum AppStatus {
        APPLIED,    // Submitted, waiting for provider
        ACCEPTED,   // Provider accepted this worker
        REJECTED,   // Provider rejected
        COMPLETED,  // Job done
        WITHDRAWN   // Worker withdrew application
    }

    // ── Constructors ─────────────────────────────

    public Application() {
        this.status = AppStatus.APPLIED;
    }

    public Application(Job job, User worker) {
        this.job    = job;
        this.worker = worker;
        this.status = AppStatus.APPLIED;
    }

    // ── Getters & Setters ─────────────────────────

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }

    public Job getJob()                          { return job; }
    public void setJob(Job job)                  { this.job = job; }

    public User getWorker()                      { return worker; }
    public void setWorker(User worker)           { this.worker = worker; }

    public String getCoverNote()                 { return coverNote; }
    public void setCoverNote(String coverNote)   { this.coverNote = coverNote; }

    public String getQuotedPrice()               { return quotedPrice; }
    public void setQuotedPrice(String quotedPrice) { this.quotedPrice = quotedPrice; }

    public AppStatus getStatus()                 { return status; }
    public void setStatus(AppStatus status)      { this.status = status; }

    public LocalDateTime getAppliedAt()          { return appliedAt; }
}
