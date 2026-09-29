package com.example.backend.Controllers;

import com.example.backend.Models.Supplier;
import com.example.backend.Services.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAll() { return supplierService.getAll(); }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) { return supplierService.create(supplier); }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier) { return supplierService.update(id, supplier); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { supplierService.delete(id); }
}
