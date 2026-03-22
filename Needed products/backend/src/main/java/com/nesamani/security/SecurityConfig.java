package com.nesamani.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS (uses corsConfigurationSource bean below)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF (we use stateless JWT, not sessions)
            .csrf(csrf -> csrf.disable())
            // Stateless — no HttpSession
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Route access rules
            .authorizeHttpRequests(auth -> auth
                // ── Public routes (no token needed) ──────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/workers").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/workers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/open").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ── Worker-only routes ────────────────────────────────────
                .requestMatchers("/api/worker/**").hasRole("WORKER")

                // ── Provider/Customer-only routes ─────────────────────────
                .requestMatchers("/api/customer/**").hasRole("PROVIDER")

                // ── Shared authenticated routes ───────────────────────────
                .requestMatchers("/api/messages/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()

                .anyRequest().authenticated()
            )
            // Add JWT filter before Spring's default auth filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // In development use "*"; in production set your exact domain
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization","Content-Type","Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
