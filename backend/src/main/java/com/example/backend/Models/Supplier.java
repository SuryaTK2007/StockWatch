package com.example.backend.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                  // unique identifier for the supplier
    private String name;              // name of the supplier company
    private String contactEmail;      // email to reach the supplier
    private Integer leadTimeDays;     // average number of days for delivery after ordering
}
