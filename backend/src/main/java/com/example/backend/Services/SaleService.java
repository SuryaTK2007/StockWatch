package com.example.backend.Services;

import com.example.backend.Models.Sale;
import com.example.backend.Repositories.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;

    public List<Sale> getAll() { return saleRepository.findAll(); }
    public Sale create(Sale sale) { return saleRepository.save(sale); }
    public void delete(Long id) { saleRepository.deleteById(id); }
}
