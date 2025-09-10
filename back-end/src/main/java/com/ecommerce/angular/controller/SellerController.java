/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.InvoiceRequest;
import com.ecommerce.angular.dto.ProductDTO;
import com.ecommerce.angular.dto.SellerRequest;
import com.ecommerce.angular.service.SellerService;
import com.ecommerce.angular.service.InvoiceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @Autowired
    private InvoiceService invoiceService;

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

    @DeleteMapping("/deleteProduct/{productId}")
    public EcommResponse deleteProduct(@PathVariable("productId") Long productId) {
        return sellerService.deleteProduct(productId);
    }

    @PostMapping("/getProducts")
    public ResponseEntity<?> getProducts(@RequestBody SellerRequest request) {
        return new ResponseEntity<>(sellerService.getProducts(request.getSellerId()), HttpStatus.OK);
    }

    @PostMapping("/getOrders")
    public ResponseEntity<?> getOrders(@RequestBody SellerRequest request) {
        return new ResponseEntity<>(sellerService.getSellerOrders(request.getSellerId()), HttpStatus.OK);
    }

    @PutMapping("/updateOrderStatus")
    public EcommResponse updateOrderStatus(@RequestBody SellerRequest request) {
        System.out.println("Request received in controller: " + request);
        return sellerService.updateOrderStatus(request);
    }

    @PostMapping("/generateInvoice")
    public ResponseEntity<byte[]> generateInvoice(@RequestBody InvoiceRequest request) {
        byte[] pdfBytes = invoiceService.generateInvoicePdf(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("inline")
                .filename("invoice.pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
