/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.CartResponse;
import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.entity.*;
import com.ecommerce.angular.repo.CartItemRepo;
import com.ecommerce.angular.repo.CartRepo;
import com.ecommerce.angular.repo.ProductRepo;
import com.ecommerce.angular.repo.UserRepo;
import com.ecommerce.angular.utils.EcommUtils;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author sagar
 */
@Service
public class CartServiceImpl implements CartService {
    
    @Autowired
    CartRepo cartRepo;
    
    @Autowired
    CartItemRepo cartItemRepo;
    
    @Autowired
    UserRepo userRepo;
    
    @Autowired
    ProductRepo productRepo;
    
    @Override
    @Transactional
    public Optional<Cart> getCart(Long userId) {
        return cartRepo.findByUserId(userId);
    }
    
    @Override
    @Transactional
    public CartResponse addOrUpdateCart(Long userId, Long productId, int quantity) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Cart cart = cartRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setTotal(BigDecimal.ZERO);
                    return newCart;
                });
        
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
        
        CartResponse cartResponse = new CartResponse();
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setOriginalPrice(product.getPrice() * existingItem.getQuantity());
            existingItem.setPrice(product.getDiscPrice() * existingItem.getQuantity());
            
            cartResponse.setQuantity(existingItem.getQuantity());
            cartResponse.setProductTotal(existingItem.getPrice());
            
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .price(product.getDiscPrice() * quantity)
                    .originalPrice(product.getPrice() * quantity)
                    .build();
            cart.getItems().add(newItem);
            
            cartResponse.setQuantity(newItem.getQuantity());
            cartResponse.setProductTotal(newItem.getPrice());
        }
        
        BigDecimal total = cart.getItems().stream()
                .map(item -> BigDecimal.valueOf(item.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotal(total);
        
        cartResponse.setUserId(userId);
        cartResponse.setProductId(productId);
        cartResponse.setCartTotal(total);
        
        cartRepo.save(cart);
        return cartResponse; // cascade saves items
    }
    
    @Override
    @Transactional
    public void removeItemFromCart(Long userId, Long productId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Cart cart = cartRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setTotal(BigDecimal.ZERO);
                    return newCart;
                });
        
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
        CartItem existingItem = existingItemOpt.get();
        
        if (existingItem.getQuantity() > 1) {
            existingItem.setQuantity(existingItem.getQuantity() - 1);
            existingItem.setOriginalPrice(product.getPrice() * existingItem.getQuantity());
            existingItem.setPrice(product.getDiscPrice() * existingItem.getQuantity());
        } else {
            cart.getItems().remove(existingItem); // Remove from in-memory list
            cartItemRepo.deleteById(existingItem.getId());
        }
        
        BigDecimal total = cart.getItems().stream()
                .map(item -> BigDecimal.valueOf(item.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotal(total);
        
        cartRepo.save(cart);
        if (cart.getItems().isEmpty()) {
            cartRepo.delete(cart);
        } else {
            cartRepo.save(cart);
        }
    }
    
}
