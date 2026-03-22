package com.nesamani.service;

import com.nesamani.dto.Dto;
import com.nesamani.model.User;
import com.nesamani.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ── Registration ──────────────────────────────────────────────────────────

    /**
     * Register a new user.
     * Maps frontend role string ("worker" / "provider") to User.Role enum.
     * Hashes password with BCrypt.
     */
    public User register(Dto.RegisterRequest req) {
        // Check for duplicate email
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("This email is already registered. Please login instead.");
        }

        // Validate role
        String roleStr = req.getRole() == null ? "" : req.getRole().trim().toLowerCase();
        if (!roleStr.equals("worker") && !roleStr.equals("provider")) {
            throw new RuntimeException("Invalid role. Must be 'worker' or 'provider'.");
        }

        User user = new User();
        user.setName(req.getName().trim());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPhone(req.getPhone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(roleStr.equals("worker") ? User.Role.WORKER : User.Role.PROVIDER);
        user.setAvailability(User.Availability.AVAILABLE);
        user.setRating(0.0);
        user.setJobsCompleted(0);

        return userRepository.save(user);
    }

    // ── Authentication ────────────────────────────────────────────────────────

    /**
     * Validate email + password.
     * Returns the User if credentials are correct.
     * Throws RuntimeException with clear message on failure.
     */
    public User authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("No account found with that email."));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect password. Please try again.");
        }

        return user;
    }

    // ── Profile ───────────────────────────────────────────────────────────────

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    public User updateProfile(String email, Dto.ProfileUpdateRequest req) {
        User user = findByEmail(email);

        if (req.getName()     != null && !req.getName().isBlank())     user.setName(req.getName().trim());
        if (req.getPhone()    != null)                                 user.setPhone(req.getPhone());
        if (req.getLocation() != null)                                 user.setLocation(req.getLocation());
        if (req.getBio()      != null)                                 user.setBio(req.getBio());
        if (req.getCategory() != null && user.getRole() == User.Role.WORKER) user.setCategory(req.getCategory());

        return userRepository.save(user);
    }

    // ── Workers list (for "Find Workers") ─────────────────────────────────────

    public List<User> getAllWorkers() {
        return userRepository.findByRole(User.Role.WORKER);
    }

    public List<User> searchWorkers(String category, String location) {
        if (category != null && !category.isBlank() && location != null && !location.isBlank()) {
            return userRepository.findWorkersByCategoryAndLocation(category, location);
        } else if (location != null && !location.isBlank()) {
            return userRepository.findWorkersByLocation(location);
        } else if (category != null && !category.isBlank()) {
            return userRepository.findByRoleAndCategoryAndAvailability(
                    User.Role.WORKER, category, User.Availability.AVAILABLE);
        }
        return getAllWorkers();
    }
}
