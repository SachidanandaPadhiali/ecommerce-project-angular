/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.entity.Product;
import java.util.List;


/**
 *
 * @author sagar
 */
public interface ProductService {
    Product getProductById(Long productId);
    List<Product> getProductByCategory(String categoryName);
    
}
