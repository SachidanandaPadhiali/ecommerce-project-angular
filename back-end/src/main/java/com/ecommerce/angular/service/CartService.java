/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.service;

import java.util.Optional;

import com.ecommerce.angular.dto.CartItemResponse;
import com.ecommerce.angular.entity.Cart;

/**
 *
 * @author sagar
 */
public interface CartService {

    CartItemResponse addOrUpdateCart(Long userId, Long productId, int quantity);
    Optional<Cart> getCart(Long userId);
    void removeItemFromCart(Long userId, Long productId);

}
