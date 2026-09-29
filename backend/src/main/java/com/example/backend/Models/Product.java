package com.example.backend.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;          // unique identifier for the product
    private String name;      // name of the product (e.g. Apple)
    private String category;  // group the product belongs to (e.g. Fruits)
    private String unit;      // unit of measurement (e.g. kg, units)
}
