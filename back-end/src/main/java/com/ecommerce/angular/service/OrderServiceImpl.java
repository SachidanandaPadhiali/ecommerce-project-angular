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
import com.ecommerce.angular.entity.SellerItems;
import com.ecommerce.angular.entity.SellerOrders;
import com.ecommerce.angular.repo.ProductRepo;
import com.ecommerce.angular.repo.UserAddressRepo;
import com.ecommerce.angular.repo.CartRepo;
import com.ecommerce.angular.repo.OrderItemRepo;
import com.ecommerce.angular.repo.OrderRepo;
import com.ecommerce.angular.repo.SellerOrdersRepo;
import com.ecommerce.angular.repo.UserRepo;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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

    @Autowired
    OrderItemRepo orderItemRepo;

    @Autowired
    SellerOrdersRepo sellerOrdersRepo;

    @Autowired
    SellerService sellerService;

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

        Map<User, List<CartItem>> sellerToItems = new HashMap<>();
        for (CartItem item : cart.getItems()) {
            User seller = sellerService.getSeller(item.getProduct().getId());
            sellerToItems.computeIfAbsent(seller, k -> new ArrayList<>()).add(item);
        }

        UserOrders userOrder = new UserOrders();
        userOrder.setUser(user);
        userOrder.setTotal(orderRequest.getOrderTotal());
        userOrder.setStatus(OrderStatus.PENDING);
        userOrder.setShippingAddress(userAddress);
        userOrder.setExpressDelivery(orderRequest.isExpressDelivery());

        userOrder = orderRepo.save(userOrder);

        List<OrderItem> allOrderItems = new ArrayList<>();

        for (Map.Entry<User, List<CartItem>> entry : sellerToItems.entrySet()) {
            User seller = entry.getKey();
            List<CartItem> items = entry.getValue();

            SellerOrders sellerOrder = new SellerOrders();
            sellerOrder.setUserOrder(userOrder);
            sellerOrder.setSeller(seller);
            sellerOrder = sellerOrdersRepo.save(sellerOrder); // persist before linking

            for (CartItem item : items) {
                Product product = item.getProduct();
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepo.save(product);

                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .sellerOrder(sellerOrder)
                        .order(userOrder)
                        .status(OrderStatus.PENDING)
                        .build();

                allOrderItems.add(orderItem);
            }

            sellerOrdersRepo.save(sellerOrder); // update with items
        }

        userOrder.setItems(allOrderItems);
        orderRepo.save(userOrder);

        // Update Cart and remove all items from cart
        cart.setUserOrder(userOrder);
        cart.getItems().clear();
        CartStatus status = CartStatus.ORDERED;
        cart.setStatus(status);
        cartRepo.save(cart);

        return userOrder.getId();
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

    @Override
    @Transactional
    public List<OrderResponse> getUserOrders(Long userId) {
        List<UserOrders> userOrders = orderRepo.findByUserId(userId);
        List<OrderResponse> userOrdersData = new ArrayList<OrderResponse>();

        for (UserOrders userOrder : userOrders) {
            OrderResponse newOrderResponse = OrderResponse.builder()
                    .id(userOrder.getId())
                    .shippingAddress(userOrder.getShippingAddress())
                    .items(userOrder.getItems())
                    .total(userOrder.getTotal())
                    .orderDate(userOrder.getCreatedAt().toLocalDate())
                    .status(userOrder.getStatus())
                    .paymentType(userOrder.getPaymentType())
                    .build();
            userOrdersData.add(newOrderResponse);
        }
        return userOrdersData;
    }
}
