/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.UserDTO;
import com.ecommerce.angular.dto.UserRequest;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.User;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author sagar
 */
public interface UserService {

    EcommResponse createAccount(UserDTO userDTO);
    public User validateUser(String username, String password);
    public List<Product> getWishList(Long userId);
    public Optional<Product> isWhishListed(Long userId, Long productId);
    EcommResponse addProductWishList(UserRequest userRequest);
    EcommResponse deleteProductWishList(UserRequest userRequest);
    
}
