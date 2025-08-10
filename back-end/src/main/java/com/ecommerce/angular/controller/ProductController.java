/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.ProductDTO;
import com.ecommerce.angular.dto.ProductRequest;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.service.ProductService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author sagar
 */
@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:8088")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping("/getProductById")
    public ResponseEntity<?> getProductById(@RequestParam Long productId) {
        Product product = productService.getProductById(productId);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/category")
    public ResponseEntity<?> getProductByCategory(@RequestParam String categoryName) {
        List<Product> products = productService.getProductByCategory(categoryName);
        if (products != null) {
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No Products Found for this category", HttpStatus.NOT_FOUND);
        }
    }
}
