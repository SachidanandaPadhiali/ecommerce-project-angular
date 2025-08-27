/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.dto;

import java.math.BigDecimal;
import java.util.List;

import com.ecommerce.angular.entity.CartItem;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author sagar
 */
@Data
@Getter
@Setter
@NoArgsConstructor
@Builder
public class CartResponse {

    private Long id;
    private UserDTO user;
    private List<CartItem> items;
    private BigDecimal total;
    private CartStatus status;

    // Constructors
    public CartResponse(Long id, UserDTO user, List<CartItem> items, BigDecimal total, CartStatus status) {
        this.id = id != null ? id : 0L;
        this.user = user != null ? user : new UserDTO();  // empty object instead of null
        this.items = items != null ? items : List.of();   // empty list instead of null
        this.total = total != null ? total : BigDecimal.valueOf(0.0);
        this.status = status != null ? status : CartStatus.EMPTY;
    }
}
/*
{
    "id": 3,
    "user": {
        "id": 2,
        "email": "test@test.com",
        "password": "Pass!111",
        "role": "user",
        "name": "test user",
        "phoneNo": "7008878436",
        "gender": "male"
    },
    "items": [
        {
            "id": 5,
            "product": {
                "id": 4,
                "name": "Samsung Galaxy S23 Ultra",
                "description": "Samsung Galaxy S23 Ultra with 6.8-inch display, Snapdragon 8 Gen 2, 200MP camera, 256GB storage.",
                "price": 129999.0,
                "discPrice": 99999.0,
                "imageUrl": "s23ultra.jpg",
                "category": "mobile",
                "quantity": 66,
                "brand": "Samsung",
                "color": "Green",
                "rating": 0.0
            },
            "quantity": 1,
            "price": 99999.0
        },
        {
            "id": 7,
            "product": {
                "id": 2,
                "name": "Samsung Galaxy S23",
                "description": "Samsung Galaxy S23 with 6.1-inch display, Snapdragon 8 Gen 2, 256GB storage.",
                "price": 84999.0,
                "discPrice": 48999.0,
                "imageUrl": "s23.jpg",
                "category": "mobile",
                "quantity": 55,
                "brand": "Samsung",
                "color": "phantom black",
                "rating": 0.0
            },
            "quantity": 1,
            "price": 48999.0
        }
    ],
    "userOrder": null,
    "total": 148998.0
}*/