package com.example.backend.Controllers;

import com.example.backend.Models.Alert;
import com.example.backend.Services.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
public class AlertController {
    private final AlertService alertService;

    @GetMapping
    public List<Alert> getAll() { return alertService.getAll(); }

    @GetMapping("/unresolved")
    public List<Alert> getUnresolved() { return alertService.getUnresolved(); }

    @PutMapping("/{id}/resolve")
    public Alert resolve(@PathVariable Long id) { return alertService.resolve(id); }
}
