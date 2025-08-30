/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.UserAddressDTO;
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
        UserAddress userAddress = userAddressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address Not Found"));
        userAddressRepo.delete(userAddress);
    }

    @Override
    @Transactional
    public UserAddress addUserAddress(UserAddressDTO userAddress) {
        User user = userRepo.findById(userAddress.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress newUserAddress = UserAddress.builder()
                .user(user)
                .userName(userAddress.getUserName())
                .phoneNumber(userAddress.getPhoneNumber())
                .flatNo(userAddress.getFlatNo())
                .addressLine1(userAddress.getAddressLine1())
                .addressLine2(userAddress.getAddressLine2())
                .city(userAddress.getCity())
                .state(userAddress.getState())
                .ZipCode(userAddress.getZipCode())
                .country(userAddress.getCountry())
                .isDefault(userAddress.getIsDefault())
                .build();

        UserAddress savedAddress = userAddressRepo.save(newUserAddress);

        if (userAddress.getIsDefault()) {
            userAddressRepo.setDefaultForUser(userAddress.getUserId(), savedAddress.getId());
        }

        return savedAddress;
    }

    @Override
    @Transactional
    public UserAddress updateUserAddress(Long addressId, UserAddressDTO userAddress) {
        UserAddress updateAddress = userAddressRepo.findById(addressId).orElseThrow(() -> new RuntimeException("User not found"));

        updateAddress.setUserName(userAddress.getUserName());
        updateAddress.setPhoneNumber(userAddress.getPhoneNumber());
        updateAddress.setFlatNo(userAddress.getFlatNo());
        updateAddress.setAddressLine1(userAddress.getAddressLine1());
        updateAddress.setAddressLine2(userAddress.getAddressLine2());
        updateAddress.setCity(userAddress.getCity());
        updateAddress.setState(userAddress.getState());
        updateAddress.setZipCode(userAddress.getZipCode());
        updateAddress.setCountry(userAddress.getCountry());

        UserAddress savedAddress = userAddressRepo.save(updateAddress);

        if (userAddress.getIsDefault()) {
            userAddressRepo.setDefaultForUser(userAddress.getUserId(), savedAddress.getId());
        }

        return savedAddress;
    }
}
