package com.lostandfound.controller;

import com.lostandfound.utilis.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/token/me")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract the token from the Bearer header
            if (!authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid Authorization header");
            }
            String token = authHeader.substring(7); // Remove "Bearer "

            // Validate the token
            String username = jwtUtil.extractUsername(token);
            if (jwtUtil.validateToken(token, username)) {
                // Generate a new token (optional)
                if (jwtUtil.isAboutToExpire(token)) {
                    String newToken = jwtUtil.generateToken(username);
                    return ResponseEntity.ok(Map.of(
                            "accessToken", newToken,
                            "message", "Token refreshed and is valid"
                    ));
                };

                return ResponseEntity.ok(Map.of(
//                        "accessToken", token,
                        "message", "Token is valid"
                ));
            } else {
                return ResponseEntity.status(401).body("Token is invalid or expired");
            }

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token is invalid or expired");
        }
    }
}
