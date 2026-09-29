package com.example.backend;

import com.example.backend.Models.User;
import com.example.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent())
            throw new RuntimeException("Username already exists");
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return jwtUtil.generateToken(username);
    }

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid credentials");
        return jwtUtil.generateToken(username);
    }
}
