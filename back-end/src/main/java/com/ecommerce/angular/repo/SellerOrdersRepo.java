/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.repo;

import com.ecommerce.angular.entity.SellerOrders;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author sagar
 */
public interface SellerOrdersRepo extends JpaRepository<SellerOrders, Long> {
    public List<SellerOrders> findBySellerId(Long sellerId);
}
