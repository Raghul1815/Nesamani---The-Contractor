package backend.src.main.java.com.nesamani.controllercom.nesamani.controller;

import com.nesamani.dto.Dto;
import com.nesamani.model.User;
import com.nesamani.security.JwtUtil;
import com.nesamani.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller — no JWT token required for these routes.
 *
 * POST /api/auth/register  — create account
 * POST /api/auth/login     — get JWT token
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private UserService userService;
    @Autowired private JwtUtil     jwtUtil;

    //  POST /api/auth/register
    //  Body: { name, email, phone, password, role: "worker"|"provider" }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Dto.RegisterRequest req) {
        // Basic field validation
        if (req.getName() == null || req.getName().isBlank()) {
            return error("Name is required.", HttpStatus.BAD_REQUEST);
        }
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return error("Email is required.", HttpStatus.BAD_REQUEST);
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            return error("Password must be at least 6 characters.", HttpStatus.BAD_REQUEST);
        }
        if (req.getRole() == null ||
            (!req.getRole().equalsIgnoreCase("worker") && !req.getRole().equalsIgnoreCase("provider"))) {
            return error("Role must be 'worker' or 'provider'.", HttpStatus.BAD_REQUEST);
        }

        try {
            User user = userService.register(req);
            return ResponseEntity.ok(new Dto.MessageResponse(
                "Account created successfully! Welcome to Nesamani, " + user.getName() + "."));
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.CONFLICT);
        }
    }


    //  POST /api/auth/login
    //  Body:     { email, password }
    //  Response: { token, role, name, userId, email, phone }
    //
    //  IMPORTANT: role is LOWERCASE "worker" or "provider"
    //  The frontend auth.js redirectByRole() depends on this exact value.
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Dto.LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return error("Email and password are required.", HttpStatus.BAD_REQUEST);
        }

        try {
            User user = userService.authenticate(req.getEmail(), req.getPassword());

            // ✅ Role MUST be lowercase for frontend auth.js
            // User.Role enum is WORKER/PROVIDER → lowercase → "worker"/"provider"
            String roleLower = user.getRole().name().toLowerCase();

            String token = jwtUtil.generateToken(user.getEmail(), roleLower);

            return ResponseEntity.ok(new Dto.AuthResponse(
                token,
                roleLower,          // "worker" or "provider"
                user.getName(),
                user.getId(),
                user.getEmail(),
                user.getPhone()
            ));

        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    // ── Helper ──────────────────────────────────────────────────────────────
    private ResponseEntity<Dto.ErrorResponse> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new Dto.ErrorResponse(message, status.value()));
    }
}
