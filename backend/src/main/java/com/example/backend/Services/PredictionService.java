package com.example.backend.Services;

import com.example.backend.Models.*;
import com.example.backend.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final SaleRepository saleRepository;
    private final PredictionRepository predictionRepository;
    private final AlertRepository alertRepository;

    public Prediction predictForProduct(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product " + productId));

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
        Double totalSold = saleRepository.sumQuantitySoldSince(productId, sevenDaysAgo);

        double dailyDemand = totalSold / 7.0;
        int daysUntilStockout = dailyDemand == 0 ? 9999 : (int) (inventory.getQuantity() / dailyDemand);
        LocalDate stockoutDate = LocalDate.now().plusDays(daysUntilStockout);

        Prediction prediction = new Prediction();
        prediction.setProduct(inventory.getProduct());
        prediction.setPredictedDailyDemand(dailyDemand);
        prediction.setDaysUntilStockout(daysUntilStockout);
        prediction.setPredictedStockoutDate(stockoutDate);
        predictionRepository.save(prediction);

        generateAlert(inventory, prediction);
        return prediction;
    }

    public List<Prediction> predictAll() {
        return productRepository.findAll().stream()
                .map(p -> predictForProduct(p.getId()))
                .toList();
    }

    private void generateAlert(Inventory inventory, Prediction prediction) {
        if (prediction.getDaysUntilStockout() >= 9999) return;

        String severity;
        if (prediction.getDaysUntilStockout() <= 3) severity = "HIGH";
        else if (prediction.getDaysUntilStockout() <= 7) severity = "MEDIUM";
        else if (prediction.getDaysUntilStockout() <= 14) severity = "LOW";
        else return;

        Alert alert = new Alert();
        alert.setProduct(inventory.getProduct());
        alert.setSeverity(severity);
        alert.setMessage("Product '" + inventory.getProduct().getName() + "' will stock out in "
                + prediction.getDaysUntilStockout() + " days on " + prediction.getPredictedStockoutDate());
        alert.setIsResolved(false);
        alertRepository.save(alert);
    }
}
