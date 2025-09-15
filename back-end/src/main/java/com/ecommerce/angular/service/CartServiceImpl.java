/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.CartItemResponse;
import com.ecommerce.angular.dto.CartResponse;
import com.ecommerce.angular.dto.CartStatus;
import com.ecommerce.angular.entity.*;
import com.ecommerce.angular.repo.CartItemRepo;
import com.ecommerce.angular.repo.CartRepo;
import com.ecommerce.angular.repo.ProductRepo;
import com.ecommerce.angular.repo.UserRepo;
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
        Optional<Cart> userCart = cartRepo.findByUserIdAndStatus(userId, CartStatus.ACTIVE);
        System.err.println(userCart);
        return userCart;
    }

    @Override
    public Optional<CartItem> isInCart(Long userId, Long productId) {

        Cart cart = cartRepo.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Check if the product is already in the cart, if yes, update the quantity,
        return cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
    }

    /**
     *
     * @param userId
     * @param productId
     * @param quantity
     * @return
     */
    @Override
    @Transactional

    public CartItemResponse addOrUpdateCart(Long userId, Long productId, int quantity) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepo.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setStatus(CartStatus.ACTIVE);
                    newCart.setTotal(BigDecimal.ZERO);
                    return newCart;
                });

        // Check if the product is already in the cart, if yes, update the quantity,
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        // If the product is already in the cart, update the quantity
        // else add the product to the cart
        CartItemResponse cartResponse = new CartItemResponse();
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

        // Generate the cart response with the quantity, product total and the updated
        // cart total
        BigDecimal total = cart.getItems().stream()
                .map(item -> BigDecimal.valueOf(item.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotal(total);

        // Generate the cart response with the quantity, product total and the updated
        // cart total
        cartResponse.setUserId(userId);
        cartResponse.setProductId(productId);
        cartResponse.setCartTotal(total);

        cartRepo.save(cart);
        return cartResponse; // cascade saves items
    }

    /**
     *
     * @param userId
     * @param productId
     */
    @Override
    @Transactional
    public void removeItemFromCart(Long userId, Long productId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepo.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
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

        // If the existing item has more than one quantity, reduce the quantity by one
        // Else remove the item from the cart
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
