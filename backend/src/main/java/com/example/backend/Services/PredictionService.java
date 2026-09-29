package com.example.backend.Services;

import com.example.backend.AuthUtil;
import com.example.backend.Models.*;
import com.example.backend.Repositories.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String ML_SERVICE_URL = "http://localhost:8000/predict";

    @Data
    public static class MlPredictRequest {
        private Long product_id;
        private Long owner_id;

        public MlPredictRequest(Long product_id, Long owner_id) {
            this.product_id = product_id;
            this.owner_id = owner_id;
        }
    }

    @Data
    public static class MlPredictResponse {
        private Long product_id;
        private Double predicted_daily_demand;
        private Integer days_until_stockout;
        private String predicted_stockout_date;
    }

    public Prediction predictForProduct(Long productId) {
        User owner = authUtil.getCurrentUser();
        Inventory inventory = inventoryRepository.findByProductIdAndOwner(productId, owner)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product " + productId));

        MlPredictResponse response;
        try {
            MlPredictRequest request = new MlPredictRequest(productId, owner.getId());
            response = restTemplate.postForObject(ML_SERVICE_URL, request, MlPredictResponse.class);
        } catch (Exception e) {
            // Fallback calculation in case ML service is unreachable
            LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
            Double totalSold = saleRepository.sumQuantitySoldSince(productId, owner, sevenDaysAgo);
            if (totalSold == null) totalSold = 0.0;
            double dailyDemand = Math.max(0.1, totalSold / 7.0);
            int daysUntilStockout = (int) (inventory.getQuantity() / dailyDemand);
            
            response = new MlPredictResponse();
            response.setProduct_id(productId);
            response.setPredicted_daily_demand(dailyDemand);
            response.setDays_until_stockout(daysUntilStockout);
            response.setPredicted_stockout_date(LocalDate.now().plusDays(daysUntilStockout).toString());
        }

        LocalDate stockoutDate = LocalDate.parse(response.getPredicted_stockout_date());

        Prediction prediction = new Prediction();
        prediction.setProduct(inventory.getProduct());
        prediction.setPredictedDailyDemand(response.getPredicted_daily_demand());
        prediction.setDaysUntilStockout(response.getDays_until_stockout());
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

