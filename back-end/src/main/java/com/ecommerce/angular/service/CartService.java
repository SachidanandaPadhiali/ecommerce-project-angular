/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.entity.Cart;

/**
 *
 * @author sagar
 */
public interface CartService {

    Cart addOrUpdateCart(Long userId, Long productId, int quantity);

    void removeItemFromCart(Long userId, Long productId);

}
