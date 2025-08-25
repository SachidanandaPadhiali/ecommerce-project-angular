package com.ecommerce.angular.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.angular.entity.UserOrders;

@Repository
public interface OrderRepo extends JpaRepository<UserOrders, Long> {
    
}
