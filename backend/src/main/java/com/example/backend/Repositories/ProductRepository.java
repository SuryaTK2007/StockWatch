package com.example.backend.Repositories;

import com.example.backend.Models.Product;
import com.example.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByOwner(User owner);
}
