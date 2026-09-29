package com.example.backend.Services;

import com.example.backend.Models.Alert;
import com.example.backend.Repositories.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {
    private final AlertRepository alertRepository;

    public List<Alert> getUnresolved() { return alertRepository.findByIsResolvedFalse(); }
    public List<Alert> getAll() { return alertRepository.findAll(); }
    public Alert resolve(Long id) {
        Alert alert = alertRepository.findById(id).orElseThrow();
        alert.setIsResolved(true);
        return alertRepository.save(alert);
    }
}
