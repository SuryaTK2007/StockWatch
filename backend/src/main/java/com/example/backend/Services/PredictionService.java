package com.example.backend.Services;

import com.example.backend.AuthUtil;
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
    private final AuthUtil authUtil;

    public Prediction predictForProduct(Long productId) {
        User owner = authUtil.getCurrentUser();
        Inventory inventory = inventoryRepository.findByProductIdAndOwner(productId, owner)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product " + productId));

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
        Double totalSold = saleRepository.sumQuantitySoldSince(productId, owner, sevenDaysAgo);

        double dailyDemand = totalSold / 7.0;
        int daysUntilStockout = dailyDemand == 0 ? 9999 : (int) (inventory.getQuantity() / dailyDemand);
        LocalDate stockoutDate = LocalDate.now().plusDays(daysUntilStockout);

        Prediction prediction = new Prediction();
        prediction.setProduct(inventory.getProduct());
        prediction.setPredictedDailyDemand(dailyDemand);
        prediction.setDaysUntilStockout(daysUntilStockout);
        prediction.setPredictedStockoutDate(stockoutDate);
        prediction.setOwner(owner);
        predictionRepository.save(prediction);

        generateAlert(inventory, prediction, owner);
        return prediction;
    }

    public List<Prediction> predictAll() {
        return productRepository.findByOwner(authUtil.getCurrentUser()).stream()
                .map(p -> predictForProduct(p.getId()))
                .toList();
    }

    private void generateAlert(Inventory inventory, Prediction prediction, User owner) {
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
        alert.setOwner(owner);
        alertRepository.save(alert);
    }
}
