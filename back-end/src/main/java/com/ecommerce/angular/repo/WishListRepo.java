/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.repo;

import com.ecommerce.angular.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author sagar
 */
public interface WishListRepo extends JpaRepository<WishList, Long> {

    @Transactional
    @Modifying
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
