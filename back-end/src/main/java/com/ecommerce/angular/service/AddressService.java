/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.UserAddressDTO;
import com.ecommerce.angular.entity.UserAddress;
import java.util.List;

/**
 *
 * @author sagar
 */
public interface AddressService {
    void removeUserAddress(Long userId, Long addressId);
    List<UserAddress> getUserAddresses(Long userId);
    UserAddress addUserAddress(UserAddressDTO userAddress);
}
