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
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private String description;

    private double price;
    private double discPrice;

    private String imageUrl;
    
    private String category;
    private int quantity;
    private String brand;
    private String color;
    
    private double rating;

    private Long sellerId;
}
