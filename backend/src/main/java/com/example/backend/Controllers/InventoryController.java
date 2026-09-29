package com.example.backend.Controllers;

import com.example.backend.Models.Inventory;
import com.example.backend.Services.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    public List<Inventory> getAll() { return inventoryService.getAll(); }

    @PostMapping
    public Inventory create(@RequestBody Inventory inventory) { return inventoryService.create(inventory); }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody Inventory inventory) { return inventoryService.update(id, inventory); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { inventoryService.delete(id); }
}
