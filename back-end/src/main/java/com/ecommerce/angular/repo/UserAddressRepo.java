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

}
