package com.example.backend.Models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                  // unique identifier for the sale record

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;          // the product that was sold

    private Double quantitySold;      // how much quantity was sold in this transaction
    private LocalDate saleDate;       // the date the sale occurred

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;               // the user who recorded this sale
}
