/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.entity.UserAddress;
import com.ecommerce.angular.repo.UserAddressRepo;
import com.ecommerce.angular.repo.UserRepo;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author sagar
 */
@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    UserRepo userRepo;
    
    @Autowired
    UserAddressRepo userAddressRepo;
    

    @Override
    @Transactional
    public List<UserAddress> getUserAddresses(Long userId) {
        return userAddressRepo.findByUserId(userId);
    }
    
    @Override
    @Transactional
    public void removeUserAddress(Long userId, Long addressId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress userAddress = userAddressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address Not Found"));
        userAddressRepo.delete(userAddress);
    }
}
