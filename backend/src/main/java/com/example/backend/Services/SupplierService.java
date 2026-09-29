package com.example.backend.Services;

import com.example.backend.AuthUtil;
import com.example.backend.Models.Supplier;
import com.example.backend.Repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final AuthUtil authUtil;

    public List<Supplier> getAll() { return supplierRepository.findByOwner(authUtil.getCurrentUser()); }

    public Supplier create(Supplier supplier) {
        supplier.setOwner(authUtil.getCurrentUser());
        return supplierRepository.save(supplier);
    }

    public Supplier update(Long id, Supplier supplier) {
        supplier.setId(id);
        supplier.setOwner(authUtil.getCurrentUser());
        return supplierRepository.save(supplier);
    }

    public void delete(Long id) { supplierRepository.deleteById(id); }
}
