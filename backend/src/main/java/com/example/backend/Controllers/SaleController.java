package com.example.backend.Controllers;

import com.example.backend.Models.Sale;
import com.example.backend.Services.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {
    private final SaleService saleService;

    @GetMapping
    public List<Sale> getAll() { return saleService.getAll(); }

    @PostMapping
    public Sale create(@RequestBody Sale sale) { return saleService.create(sale); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { saleService.delete(id); }
}
