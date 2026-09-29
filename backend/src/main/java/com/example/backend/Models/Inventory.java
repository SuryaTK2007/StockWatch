package com.example.backend.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // unique identifier for the inventory record

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;              // the product this inventory record belongs to

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;            // the supplier who provides this product

    private Double quantity;              // current stock available
    private Double reorderThreshold;      // minimum stock level before a reorder should be triggered
}
