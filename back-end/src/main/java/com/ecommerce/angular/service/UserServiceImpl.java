/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.UserDTO;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.repo.UserRepo;
import com.ecommerce.angular.utils.EcommUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author sagar
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepo userRepo;

    @Override
    public EcommResponse createAccount(UserDTO userDTO) {
        /**
         * Check if the user is already present if present return the code and
         * show the message in AccountUtils
         */
        if (userRepo.existsByEmail(userDTO.getEmail())) {
            return EcommResponse.builder()
                    .responseCode(EcommUtils.ACCOUNT_EXISTS_CODE)
                    .responseMessage(EcommUtils.ACCOUNT_EXISTS_MESSAGE)
                    .build();
        }
        /**
         * Creating an account - saving a new user into the database
         */
        User newUser = User.builder()
                .email(userDTO.getEmail())
                .password(userDTO.getPassword())
                .name(userDTO.getName())
                .gender(userDTO.getGender())
                .phoneNo(String.valueOf(userDTO.getPhoneNo()))
                .role(userDTO.getRole())
                .build();
        
        /**
         * Save the created User
         */
        User savedUser = userRepo.save(newUser);
        userRepo.save(savedUser);

        return EcommResponse.builder()
                .responseCode(EcommUtils.ACCOUNT_CREATED_CODE)
                .responseMessage(EcommUtils.ACCOUNT_CREATED_MESSAGE)
                .build();
    }

    @Override
    public User validateUser(String username, String password) {
        User user = userRepo.findByEmail(username);
        return (user != null && user.getPassword().equals(password)) ? user : null;
    }

}
