/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.ProductDTO;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.SellerRequest;
import com.ecommerce.angular.service.SellerService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author sagar
 */
@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:8088")
public class SellerController {

    @Autowired
    SellerService sellerService;

    @PostMapping("/addProduct")
    public EcommResponse addProduct(@RequestBody ProductDTO product) {
        return sellerService.addProduct(product);
    }

    @PutMapping("/addProduct/{id}")
    public EcommResponse updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO product) {
        return sellerService.updateProduct(id, product);
    }

    @PostMapping("/deleteProduct")
    public EcommResponse deleteProduct(@RequestBody ProductDTO product) {
        return sellerService.deleteProduct(product);
    }

    @PostMapping("/getProducts")
    public ResponseEntity<?> getProducts(@RequestBody SellerRequest request) {
        return new ResponseEntity<>(sellerService.getProducts(request.getSellerId()), HttpStatus.OK);
    }

    /*
     * @PostMapping("/getProductById")
     * public ResponseEntity<?> getProductById(@RequestBody Long productId) {
     * ProductDTO product = productService.getProductById(productId);
     * if (product != null) {
     * return new ResponseEntity<>(product, HttpStatus.OK);
     * } else {
     * return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
     * }
     * }
     */
}
