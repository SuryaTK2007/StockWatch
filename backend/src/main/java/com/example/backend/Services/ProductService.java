package com.example.backend.Services;

import com.example.backend.Models.Product;
import com.example.backend.Repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAll() { return productRepository.findAll(); }
    public Product create(Product product) { return productRepository.save(product); }
    public Product update(Long id, Product product) {
        product.setId(id);
        return productRepository.save(product);
    }
    public void delete(Long id) { productRepository.deleteById(id); }
}
