package com.nesamani.security;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ── Public routes (no token) ──────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/open").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/providers").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ── Needer-only routes ────────────────────────
                // Role stored as "needer" in JWT → ROLE_NEEDER in Spring Security
                .requestMatchers("/api/needer/**").hasRole("NEEDER")

                // ── Provider-only routes ──────────────────────
                // Role stored as "provider" in JWT → ROLE_PROVIDER in Spring Security
                .requestMatchers("/api/provider/**").hasRole("PROVIDER")

                // ── Any authenticated user ────────────────────
                .requestMatchers("/api/messages/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/reviews/**").authenticated()

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization","Content-Type","Accept"));
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
