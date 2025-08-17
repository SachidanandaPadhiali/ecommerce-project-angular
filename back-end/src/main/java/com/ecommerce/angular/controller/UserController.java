/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import com.ecommerce.angular.dto.CartResponse;
import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.UserDTO;
import com.ecommerce.angular.dto.UserRequest;
import com.ecommerce.angular.entity.Cart;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.entity.UserAddress;
import com.ecommerce.angular.service.AddressService;
import com.ecommerce.angular.service.CartService;
import com.ecommerce.angular.service.UserService;
import com.ecommerce.angular.utils.EcommUtils;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @Autowired
    AddressService addressService;
    
    @Autowired
    CartService cartService;

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

    @PostMapping("/getWishList")
    public ResponseEntity<?> getProducts(@RequestBody UserRequest userRequest) {
        return new ResponseEntity<>(userService.getWishList(userRequest.getUserId()), HttpStatus.OK);
    }

    @PostMapping("/addProductWishList")
    public EcommResponse addProductWishList(@RequestBody UserRequest userRequest) {
        return userService.addProductWishList(userRequest);
    }

    @PostMapping("/deleteProductWishList")
    public EcommResponse deleteProductWishList(@RequestBody UserRequest userRequest) {
        return userService.deleteProductWishList(userRequest);
    }

    @PostMapping("/addToCart")
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        CartResponse updatedCart = cartService.addOrUpdateCart(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @PostMapping("/removeFromCart")
    public ResponseEntity<EcommResponse> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.ok(EcommResponse.builder()
                .responseCode(EcommUtils.CART_UPDATED_CODE)
                .responseMessage(EcommUtils.CART_UPDATED_MESSAGE)
                .build());
    }

    @PostMapping("/getCart")
    public Optional<Cart> getCart(@RequestBody UserRequest userRequest) {
        return cartService.getCart(userRequest.getUserId());
    }

    @PostMapping("/getUserAddresses")
    public List<UserAddress> getUserAddresses(@RequestBody UserRequest userRequest) {
        return addressService.getUserAddresses(userRequest.getUserId());
    }

    @PostMapping("/removeUserAddres")
    public ResponseEntity<EcommResponse> removeUserAddres(
            @RequestParam Long userId,
            @RequestParam Long addressId) {
        
        addressService.removeUserAddress(userId, addressId);
        return ResponseEntity.ok(EcommResponse.builder()
                .responseCode(EcommUtils.ADDRESS_DELETED_CODE)
                .responseMessage(EcommUtils.ADDRESS_DELETED_MESSAGE)
                .build());
    }
}
