/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.dto;

import com.ecommerce.angular.entity.OrderItem;
import com.ecommerce.angular.entity.UserAddress;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author sagar
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerOrdersDTO {
    private Long id;
    private UserAddress shippingAddress;
    private List<OrderItem> items;
    private OrderStatus status;
}
