package com.example.backend.Services;

import com.example.backend.AuthUtil;
import com.example.backend.Models.Product;
import com.example.backend.Models.User;
import com.example.backend.Repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final AuthUtil authUtil;

    public List<Product> getAll() { return productRepository.findByOwner(authUtil.getCurrentUser()); }

    public Product create(Product product) {
        product.setOwner(authUtil.getCurrentUser());
        return productRepository.save(product);
    }

    public Product update(Long id, Product product) {
        product.setId(id);
        product.setOwner(authUtil.getCurrentUser());
        return productRepository.save(product);
    }

    public void delete(Long id) { productRepository.deleteById(id); }
}
