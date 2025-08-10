/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.repo.ProductRepo;
import java.util.List;

/**
 *
 * @author sagar
 */
@Service
public class ProductServieImpl implements ProductService {

    @Autowired
    ProductRepo productRepo;

    @Override
    public Product getProductById(Long id) {

        // Fetch the product by ID from the repository
        /*
         * This method retrieves a product by its ID from the repository.
         * @param id The ID of the product to retrieve.
         * @return The product entity if found, otherwise null.
         */
        return productRepo.findProductById(id);
    }

    @Override
    public List<Product> getProductByCategory(String categoryName) {
        return productRepo.findProductByCategory(categoryName);
    }

}
