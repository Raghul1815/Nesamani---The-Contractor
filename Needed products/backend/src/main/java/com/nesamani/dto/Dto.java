package com.nesamani.dto;

/**
 * All DTO (Data Transfer Object) classes used by controllers.
 * Kept in one file for simplicity — split into separate files if project grows.
 */
public class Dto {

    // ── Auth DTOs ────────────────────────────────────────────────────────────

    /** POST /api/auth/register */
    public static class RegisterRequest {
        private String name;
        private String email;
        private String phone;
        private String password;
        private String role;    // "worker" or "provider" from frontend

        public String getName()     { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail()    { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone()    { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole()     { return role; }
        public void setRole(String role) { this.role = role; }
    }

    /** POST /api/auth/login */
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail()    { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    /**
     * Login/Register response.
     * Frontend (auth.js) reads: token, role, name, userId, email
     * role MUST be lowercase: "worker" or "provider"
     */
    public static class AuthResponse {
        private String token;
        private String role;
        private String name;
        private Long   userId;
        private String email;
        private String phone;

        public AuthResponse(String token, String role, String name, Long userId, String email, String phone) {
            this.token  = token;
            this.role   = role;
            this.name   = name;
            this.userId = userId;
            this.email  = email;
            this.phone  = phone;
        }

        public String getToken()   { return token; }
        public String getRole()    { return role; }
        public String getName()    { return name; }
        public Long   getUserId()  { return userId; }
        public String getEmail()   { return email; }
        public String getPhone()   { return phone; }
    }

    // ── Job DTOs ─────────────────────────────────────────────────────────────

    /** POST /api/customer/jobs — create a job */
    public static class JobRequest {
        private String title;
        private String category;
        private String location;
        private String budget;
        private String duration;
        private String description;
        private String date;        // ISO date string: "2026-03-20"

        public String getTitle()       { return title; }
        public void setTitle(String t) { this.title = t; }

        public String getCategory()        { return category; }
        public void setCategory(String c)  { this.category = c; }

        public String getLocation()        { return location; }
        public void setLocation(String l)  { this.location = l; }

        public String getBudget()          { return budget; }
        public void setBudget(String b)    { this.budget = b; }

        public String getDuration()        { return duration; }
        public void setDuration(String d)  { this.duration = d; }

        public String getDescription()     { return description; }
        public void setDescription(String d) { this.description = d; }

        public String getDate()            { return date; }
        public void setDate(String date)   { this.date = date; }
    }

    /** POST /api/worker/jobs/{id}/apply — apply to a job */
    public static class ApplyRequest {
        private String coverNote;
        private String quotedPrice;

        public String getCoverNote()           { return coverNote; }
        public void setCoverNote(String n)     { this.coverNote = n; }

        public String getQuotedPrice()         { return quotedPrice; }
        public void setQuotedPrice(String p)   { this.quotedPrice = p; }
    }

    // ── Profile DTOs ─────────────────────────────────────────────────────────

    /** PUT /api/worker/profile  or  PUT /api/customer/profile */
    public static class ProfileUpdateRequest {
        private String name;
        private String phone;
        private String location;
        private String bio;
        private String category;    // worker only

        public String getName()        { return name; }
        public void setName(String n)  { this.name = n; }

        public String getPhone()       { return phone; }
        public void setPhone(String p) { this.phone = p; }

        public String getLocation()        { return location; }
        public void setLocation(String l)  { this.location = l; }

        public String getBio()         { return bio; }
        public void setBio(String b)   { this.bio = b; }

        public String getCategory()        { return category; }
        public void setCategory(String c)  { this.category = c; }
    }

    // ── Generic Responses ────────────────────────────────────────────────────

    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }

    public static class ErrorResponse {
        private String error;
        private int    status;
        public ErrorResponse(String error, int status) { this.error = error; this.status = status; }
        public String getError()  { return error; }
        public int    getStatus() { return status; }
    }
}
