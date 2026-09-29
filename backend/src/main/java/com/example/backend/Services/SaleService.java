package com.example.backend.Services;

import com.example.backend.AuthUtil;
import com.example.backend.Models.Inventory;
import com.example.backend.Models.Sale;
import com.example.backend.Repositories.InventoryRepository;
import com.example.backend.Repositories.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;
    private final InventoryRepository inventoryRepository;
    private final PredictionService predictionService;
    private final AuthUtil authUtil;

    public List<Sale> getAll() { return saleRepository.findByOwner(authUtil.getCurrentUser()); }

    public Sale create(Sale sale) {
        var owner = authUtil.getCurrentUser();
        Inventory inventory = inventoryRepository.findByProductIdAndOwner(sale.getProduct().getId(), owner)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product " + sale.getProduct().getId()));

        if (inventory.getQuantity() < sale.getQuantitySold())
            throw new RuntimeException("Insufficient stock. Available: " + inventory.getQuantity());

        inventory.setQuantity(inventory.getQuantity() - sale.getQuantitySold());
        inventoryRepository.save(inventory);

        sale.setOwner(owner);
        Sale saved = saleRepository.save(sale);
        predictionService.predictForProduct(sale.getProduct().getId());
        return saved;
    }

    public void delete(Long id) { saleRepository.deleteById(id); }
}
