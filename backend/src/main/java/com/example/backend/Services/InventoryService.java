package com.example.backend.Services;

import com.example.backend.AuthUtil;
import com.example.backend.Models.Inventory;
import com.example.backend.Repositories.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final AuthUtil authUtil;

    public List<Inventory> getAll() { return inventoryRepository.findByOwner(authUtil.getCurrentUser()); }

    public Inventory create(Inventory inventory) {
        inventory.setOwner(authUtil.getCurrentUser());
        return inventoryRepository.save(inventory);
    }

    public Inventory update(Long id, Inventory updated) {
        Inventory existing = inventoryRepository.findById(id).orElseThrow();
        existing.setQuantity(updated.getQuantity());
        existing.setReorderThreshold(updated.getReorderThreshold());
        return inventoryRepository.save(existing);
    }

    public void delete(Long id) { inventoryRepository.deleteById(id); }
}
