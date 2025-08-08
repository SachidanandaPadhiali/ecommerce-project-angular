/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.repo;

import com.ecommerce.angular.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author sagar
 */
public interface UserRepo extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email);
    User findByEmail(String email);
}
