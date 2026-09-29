package com.example.backend.Controllers;

import com.example.backend.Models.Prediction;
import com.example.backend.Services.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/predictions")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    @PostMapping("/run")
    public List<Prediction> runAll() { return predictionService.predictAll(); }

    @PostMapping("/run/{productId}")
    public Prediction runForProduct(@PathVariable Long productId) { return predictionService.predictForProduct(productId); }
}
