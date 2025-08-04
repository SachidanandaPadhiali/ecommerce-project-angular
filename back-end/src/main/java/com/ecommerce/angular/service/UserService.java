/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.UserDTO;
import com.ecommerce.angular.entity.User;

/**
 *
 * @author sagar
 */
public interface UserService {

    EcommResponse createAccount(UserDTO userDTO);
    public User validateUser(String username, String password);

}
