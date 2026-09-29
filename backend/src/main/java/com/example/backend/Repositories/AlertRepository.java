package com.example.backend.Repositories;

import com.example.backend.Models.Alert;
import com.example.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByOwnerAndIsResolvedFalse(User owner);
    List<Alert> findByOwner(User owner);
}
