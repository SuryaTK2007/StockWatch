package com.example.backend.Repositories;

import com.example.backend.Models.Prediction;
import com.example.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByOwner(User owner);
}
