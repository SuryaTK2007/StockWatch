package com.example.backend.Repositories;

import com.example.backend.Models.Sale;
import com.example.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByOwner(User owner);

    @Query("SELECT COALESCE(SUM(s.quantitySold), 0) FROM Sale s WHERE s.product.id = :productId AND s.owner = :owner AND s.saleDate >= :from")
    Double sumQuantitySoldSince(Long productId, User owner, LocalDate from);
}
