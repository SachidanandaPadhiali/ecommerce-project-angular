/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.dto;

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
public class SellerRequest {

    private Long sellerId;
    private Long orderId;
    private Long orderItemId;
    private OrderStatus status;

    public String toString() {
        return "SellerRequest{" + "sellerId=" + sellerId + ", orderId=" + orderId + ", orderItemId" + orderItemId + ", status=" + status + '}';
    }
}
