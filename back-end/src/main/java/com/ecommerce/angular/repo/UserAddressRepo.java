/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.repo;

import com.ecommerce.angular.entity.UserAddress;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author sagar
 */
public interface UserAddressRepo extends JpaRepository<UserAddress, Long> {

    List<UserAddress> findByUserId(Long UserId);

    @Modifying
    @Transactional
    @Query("""
  UPDATE UserAddress a
  SET a.isDefault = CASE WHEN a.id = :addressId THEN true ELSE false END
  WHERE a.user.id = :userId
""")
    void setDefaultForUser(@Param("userId") Long userId, @Param("addressId") Long addressId);

    @Query(value = """
        SELECT * FROM ecommerce_java.user_address ua 
        WHERE ua.user_id = (
            SELECT o.user_id 
            FROM ecommerce_java.order_item oi 
            JOIN ecommerce_java.user_orders o ON oi.product_id = o.id 
            WHERE oi.id = :orderItemId
        ) AND ua.is_default = 1
        """, nativeQuery = true)
    UserAddress findDefaultAddressByOrderItemId(@Param("orderItemId") Long orderItemId);
}
