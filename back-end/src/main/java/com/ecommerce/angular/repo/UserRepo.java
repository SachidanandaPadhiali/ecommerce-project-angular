/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.repo;

import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author sagar
 */
public interface UserRepo extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email);

    User findByEmail(String email);
    
    @Query("SELECT w.product FROM WishList w JOIN w.product p WHERE w.user.id = :userId")
    List<Product> getWishList(@Param("userId") Long userId);
    
    @Query("SELECT w.product FROM WishList w JOIN w.product p WHERE w.user.id = :userId AND w.product.id = :productId ")
    Optional<Product> isWishlisted(@Param("userId") Long userId, @Param("productId") Long productId);
    
}
