package com.nesamani.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Job posted by a PROVIDER (service provider / customer).
 * Workers browse these and apply.
 */
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;    // Plumbing, Electrical, etc.

    @Column(nullable = false)
    private String location;

    private String budget;      // e.g. "₹500" or "₹200/day"
    private String duration;    // e.g. "One-time", "1 week"

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate expectedDate;

    @Enumerated(EnumType.STRING)
    private JobStatus status;   // OPEN, ACTIVE, COMPLETED, CANCELLED

    // Relationship: job posted by this provider
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    // Relationship: assigned worker (set when application is accepted)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private User worker;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // ── Status Enum ──────────────────────────────

    public enum JobStatus {
        OPEN,       // Just posted, accepting applications
        ACTIVE,     // Worker assigned, work in progress
        COMPLETED,  // Work done
        CANCELLED   // Cancelled by provider
    }

    // ── Constructors ─────────────────────────────

    public Job() {
        this.status = JobStatus.OPEN;
    }

    // ── Getters & Setters ─────────────────────────

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }

    public String getTitle()                     { return title; }
    public void setTitle(String title)           { this.title = title; }

    public String getCategory()                  { return category; }
    public void setCategory(String category)     { this.category = category; }

    public String getLocation()                  { return location; }
    public void setLocation(String location)     { this.location = location; }

    public String getBudget()                    { return budget; }
    public void setBudget(String budget)         { this.budget = budget; }

    public String getDuration()                  { return duration; }
    public void setDuration(String duration)     { this.duration = duration; }

    public String getDescription()               { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getExpectedDate()           { return expectedDate; }
    public void setExpectedDate(LocalDate d)     { this.expectedDate = d; }

    public JobStatus getStatus()                 { return status; }
    public void setStatus(JobStatus status)      { this.status = status; }

    public User getProvider()                    { return provider; }
    public void setProvider(User provider)       { this.provider = provider; }

    public User getWorker()                      { return worker; }
    public void setWorker(User worker)           { this.worker = worker; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
}
