/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.CartStatus;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.angular.dto.OrderRequest;
import com.ecommerce.angular.dto.OrderResponse;
import com.ecommerce.angular.dto.OrderStatus;

import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.entity.UserAddress;
import com.ecommerce.angular.entity.UserOrders;
import com.ecommerce.angular.entity.Cart;
import com.ecommerce.angular.entity.CartItem;
import com.ecommerce.angular.entity.OrderItem;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.repo.ProductRepo;
import com.ecommerce.angular.repo.UserAddressRepo;
import com.ecommerce.angular.repo.CartRepo;
import com.ecommerce.angular.repo.OrderRepo;
import com.ecommerce.angular.repo.UserRepo;

import jakarta.transaction.Transactional;

/**
 *
 * @author sagar
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    CartRepo cartRepo;

    @Autowired
    ProductRepo productRepo;

    @Autowired
    UserAddressRepo userAddressRepo;

    @Autowired
    OrderRepo orderRepo;

    /**
     * API to generate an order
     *
     * @param orderRequest OrderRequest containing the user id, cart id and
     * address id
     * @return Generated orderId
     */
    @Override
    @Transactional
    public Long generateOrder(OrderRequest orderRequest) {
        User user = userRepo.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findById(orderRequest.getCartId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        UserAddress userAddress = userAddressRepo.findById(orderRequest.getAddressId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        System.out.println(user);
        System.out.println(cart);
        System.out.println(userAddress);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .build();
            orderItems.add(orderItem);

            // Update Inventory
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepo.save(product);
        }

        // SellerItems sellerItem =
        // sellerItemRepo.findByProductId(item.getProduct().getId());
        UserOrders userOrder = UserOrders.builder()
                .user(user).items(orderItems).total(orderRequest.getOrderTotal()).status(OrderStatus.PENDING)
                .shippingAddress(userAddress).isExpressDelivery(orderRequest.isExpressDelivery()).build();

        for (OrderItem item : orderItems) {
            item.setOrder(userOrder);
        }

        UserOrders savedOrder = orderRepo.save(userOrder);

        // Update Cart and remove all items from cart
        cart.setUserOrder(savedOrder);
        cart.getItems().clear();
        CartStatus status = CartStatus.ORDERED;
        cart.setStatus(status);
        cartRepo.save(cart);

        return savedOrder.getId();
    }

    @Override
    @Transactional
    public OrderResponse getOrderData(Long orderId) {
        UserOrders userOrder = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        System.out.println(userOrder);
        return OrderResponse.builder()
                .id(orderId)
                .shippingAddress(userOrder.getShippingAddress())
                .items(userOrder.getItems())
                .total(userOrder.getTotal())
                .status(userOrder.getStatus())
                .build();
    }
}
