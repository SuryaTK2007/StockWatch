package com.example.backend.Repositories;

import com.example.backend.Models.Supplier;
import com.example.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByOwner(User owner);
}
