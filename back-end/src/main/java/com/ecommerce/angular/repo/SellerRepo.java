/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.repo;

import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author sagar
 */
public interface SellerRepo extends JpaRepository<User, Long> {

    /**
     * Finds a seller by their ID.
     *
     * @param sellerId the ID of the seller
     * @return the seller if found, otherwise null
     */
    Optional findById(Long sellerId);

    /**
     * Finds products by the seller's ID.
     *
     * @param sellerId the ID of the seller
     * @return a list of products associated with the seller
     */
    @Query("SELECT si.product FROM SellerItems si WHERE si.seller.id = :sellerId")
    List<Product> findProductsBySellerId(@Param("sellerId") Long sellerId);

}
