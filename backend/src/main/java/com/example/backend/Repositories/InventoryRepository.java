package com.example.backend.Repositories;

import com.example.backend.Models.Inventory;
import com.example.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductIdAndOwner(Long productId, User owner);
    List<Inventory> findByOwner(User owner);
}
