package com.ecommerce.angular.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.angular.entity.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {
    OrderItem findByIdAndOrderId(Long id, Long orderId);
}
