package com.example.backend.Models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                              // unique identifier for the prediction record

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;                      // the product this prediction is for

    private Double predictedDailyDemand;          // average units sold per day based on last 7 days
    private LocalDate predictedStockoutDate;      // estimated date when stock will run out
    private Integer daysUntilStockout;            // number of days remaining before stockout
}
