package com.nesamani.controller;

import com.nesamani.dto.Dto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Catches all unhandled exceptions across every controller.
 * Returns clean JSON instead of Spring's default HTML error page.
 * This prevents the frontend from crashing on unexpected errors.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Generic runtime errors (validation, "not found", etc.) */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Dto.ErrorResponse> handleRuntime(RuntimeException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new Dto.ErrorResponse(e.getMessage(), 400));
    }

    /** 403 — wrong role trying to access protected route */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Dto.ErrorResponse> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new Dto.ErrorResponse(
                        "You do not have permission to access this resource.", 403));
    }

    /** Catch-all for anything else */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Dto.ErrorResponse> handleGeneric(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new Dto.ErrorResponse(
                        "An unexpected error occurred. Please try again.", 500));
    }
}
