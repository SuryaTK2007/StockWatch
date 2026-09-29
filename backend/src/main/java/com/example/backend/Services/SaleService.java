package com.example.backend.Services;

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

    public List<Sale> getAll() { return saleRepository.findAll(); }

    public Sale create(Sale sale) {
        Inventory inventory = inventoryRepository.findByProductId(sale.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found for product " + sale.getProduct().getId()));

        if (inventory.getQuantity() < sale.getQuantitySold())
            throw new RuntimeException("Insufficient stock. Available: " + inventory.getQuantity());

        inventory.setQuantity(inventory.getQuantity() - sale.getQuantitySold());
        inventoryRepository.save(inventory);

        return saleRepository.save(sale);
    }

    public void delete(Long id) { saleRepository.deleteById(id); }
}
