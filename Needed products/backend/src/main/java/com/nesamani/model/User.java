package com.nesamani.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Shared user entity for both workers and service providers.
 * Role "WORKER"   → accesses worker-dashboard.html
 * Role "PROVIDER" → accesses customer-dashboard.html
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;   // BCrypt hashed — never plain text

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;         // WORKER or PROVIDER

    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    // Worker-specific fields
    private String category;   // e.g. Plumber, Electrician
    private Double rating;
    private Integer jobsCompleted;

    @Enumerated(EnumType.STRING)
    private Availability availability;  // AVAILABLE, BUSY, OFFLINE

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ── Enums ────────────────────────────────────

    public enum Role {
        WORKER,    // "worker"   in frontend
        PROVIDER   // "provider" in frontend
    }

    public enum Availability {
        AVAILABLE, BUSY, OFFLINE
    }

    // ── Constructors ─────────────────────────────

    public User() {}

    public User(String name, String email, String password, Role role) {
        this.name     = name;
        this.email    = email;
        this.password = password;
        this.role     = role;
        this.rating   = 0.0;
        this.jobsCompleted = 0;
        this.availability  = Availability.AVAILABLE;
    }

    // ── Getters & Setters ─────────────────────────

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public String getName()                    { return name; }
    public void setName(String name)           { this.name = name; }

    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }

    public String getPassword()                { return password; }
    public void setPassword(String password)   { this.password = password; }

    public String getPhone()                   { return phone; }
    public void setPhone(String phone)         { this.phone = phone; }

    public Role getRole()                      { return role; }
    public void setRole(Role role)             { this.role = role; }

    public String getLocation()                { return location; }
    public void setLocation(String location)   { this.location = location; }

    public String getBio()                     { return bio; }
    public void setBio(String bio)             { this.bio = bio; }

    public String getCategory()                { return category; }
    public void setCategory(String category)   { this.category = category; }

    public Double getRating()                  { return rating; }
    public void setRating(Double rating)       { this.rating = rating; }

    public Integer getJobsCompleted()                      { return jobsCompleted; }
    public void setJobsCompleted(Integer jobsCompleted)    { this.jobsCompleted = jobsCompleted; }

    public Availability getAvailability()                  { return availability; }
    public void setAvailability(Availability availability) { this.availability = availability; }

    public LocalDateTime getCreatedAt()                    { return createdAt; }
    public LocalDateTime getUpdatedAt()                    { return updatedAt; }
}
