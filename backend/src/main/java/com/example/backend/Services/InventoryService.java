package com.example.backend.Services;

import com.example.backend.Models.Inventory;
import com.example.backend.Repositories.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAll() { return inventoryRepository.findAll(); }
    public Inventory create(Inventory inventory) { return inventoryRepository.save(inventory); }
    public Inventory update(Long id, Inventory inventory) {
        inventory.setId(id);
        return inventoryRepository.save(inventory);
    }
    public void delete(Long id) { inventoryRepository.deleteById(id); }
}
