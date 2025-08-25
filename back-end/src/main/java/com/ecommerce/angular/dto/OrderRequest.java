package com.ecommerce.angular.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    private Long userId;
    private Long addressId;
    private Long cartId;
    private BigDecimal orderTotal;
    private boolean isExpressDelivery;
    
}
