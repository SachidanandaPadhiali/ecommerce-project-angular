/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.UserDTO;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author sagar
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8088")
public class UserController {

    @Autowired
    UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userRequests) {
        User user = userService.validateUser(userRequests.getEmail(), userRequests.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/user")
    public EcommResponse createAccount(@RequestBody UserDTO userDTO) {
        return userService.createAccount(userDTO);
    }

}
