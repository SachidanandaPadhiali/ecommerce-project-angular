/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.OrderRequest;
import com.ecommerce.angular.dto.OrderResponse;


/**
 *
 * @author sagar
 */
public interface OrderService {
    
    public Long generateOrder(OrderRequest orderRequest);
    public OrderResponse getOrderData(Long orderId);
}
