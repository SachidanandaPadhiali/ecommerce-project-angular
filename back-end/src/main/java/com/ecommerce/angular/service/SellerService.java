/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.ProductDTO;
import com.ecommerce.angular.dto.SellerRequest;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.UserOrders;
import java.util.List;

/**
 *
 * @author sagar
 */
public interface SellerService {

    /**
     * Adds a new product to the seller's inventory.
     *
     * @param product The product details to be added.
     * @return EcommResponse containing the result of the operation.
     */
    EcommResponse addProduct(ProductDTO product);
    /**
     * Updates an existing product in the seller's inventory.
     *
     * @param product The updated product details.
     * @return EcommResponse containing the result of the operation.
     */
    EcommResponse updateProduct(Long id, ProductDTO product);
    /**
     * Deletes a product from the seller's inventory.
     *
     * @param productId is the Id of the product to be deleted.
     * @return EcommResponse containing the result of the operation.
     */
    EcommResponse deleteProduct(Long productId);
    /**
     * Retrieves list of products added by the seller.
     *
     * @param sellerId The product to be retrieved.
     * @return Product entity containing the product details.
     */
    public List<Product> getProducts(Long sellerId);

    public List<UserOrders> getOrders(SellerRequest request);
}
