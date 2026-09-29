package com.example.backend.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // unique identifier for the alert

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;              // the product this alert is about

    private String message;               // human-readable description of the stockout warning
    private String severity;              // urgency level: LOW (≤14 days), MEDIUM (≤7 days), HIGH (≤3 days)
    private Boolean isResolved = false;   // whether the alert has been acknowledged and acted upon

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;                   // the user who owns this alert
}
