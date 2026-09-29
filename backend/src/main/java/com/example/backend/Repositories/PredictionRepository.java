package com.example.backend.Repositories;

import com.example.backend.Models.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    Optional<Prediction> findTopByProductIdOrderByIdDesc(Long productId);
}
