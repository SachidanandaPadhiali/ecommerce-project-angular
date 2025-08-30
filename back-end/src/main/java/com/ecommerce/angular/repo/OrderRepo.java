package com.ecommerce.angular.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.angular.entity.UserOrders;
import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<UserOrders, Long> {

    List<UserOrders> findByUserId(Long UserId);

}
