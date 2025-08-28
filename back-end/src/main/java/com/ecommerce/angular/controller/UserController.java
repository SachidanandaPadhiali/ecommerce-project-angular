/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import com.ecommerce.angular.dto.CartItemResponse;
import com.ecommerce.angular.dto.CartResponse;
import com.ecommerce.angular.dto.CartStatus;
import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.OrderRequest;
import com.ecommerce.angular.dto.UserAddressDTO;
import com.ecommerce.angular.dto.UserDTO;
import com.ecommerce.angular.dto.UserRequest;
import com.ecommerce.angular.entity.Cart;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.entity.UserAddress;
import com.ecommerce.angular.service.AddressService;
import com.ecommerce.angular.service.CartService;
import com.ecommerce.angular.service.OrderService;
import com.ecommerce.angular.service.UserService;
import com.ecommerce.angular.utils.EcommUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @Autowired
    OrderService orderService;

    /**
     * API to validate the user credentials and return the user object if valid
     * 
     * @param userRequests UserDTO containing the email and password of the user
     * @return ResponseEntity containing the user object if valid, else HTTP 401
     *         Unauthorized response
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userRequests) {
        User user = userService.validateUser(userRequests.getEmail(), userRequests.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    /**
     * API to create a new user account
     * 
     * @param userDTO UserDTO containing the email and password of the user
     * @return ResponseEntity containing the user object if valid, else HTTP 401
     *         Unauthorized response
     */
    @PostMapping("/user")
    public EcommResponse createAccount(@RequestBody UserDTO userDTO) {
        return userService.createAccount(userDTO);
    }

    /**
     * API to get the wish list of the user
     * 
     * @param userRequest UserRequest containing the user id
     * @return ResponseEntity containing the list of products in the wish list
     */
    @PostMapping("/getWishList")
    public ResponseEntity<?> getProducts(@RequestBody UserRequest userRequest) {
        return new ResponseEntity<>(userService.getWishList(userRequest.getUserId()), HttpStatus.OK);
    }

    /**
     * API to add a product to the user's wish list
     * 
     * @param userRequest UserRequest containing the user id and product id
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
    @PostMapping("/addProductWishList")
    public EcommResponse addProductWishList(@RequestBody UserRequest userRequest) {
        return userService.addProductWishList(userRequest);
    }

    /**
     * API to delete a product from the user's wish list
     * 
     * @param userRequest UserRequest containing the user id and product id
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
    @PostMapping("/deleteProductWishList")
    public EcommResponse deleteProductWishList(@RequestBody UserRequest userRequest) {
        return userService.deleteProductWishList(userRequest);
    }

    /**
     * API to add a product to the user's cart
     * 
     * @param userId    the user id
     * @param productId the product id
     * @param quantity  the quantity of the product to add, default is 1
     * @return ResponseEntity containing the updated cart object
     */
    @PostMapping("/addToCart")
    public ResponseEntity<CartItemResponse> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        CartItemResponse updatedCart = cartService.addOrUpdateCart(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * API to remove a product from the user's cart
     * 
     * @param userId    the user id
     * @param productId the product id
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
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

    private CartResponse mapToResponse(Cart cart) {
        return new CartResponse(
                cart.getId(),
                new UserDTO(cart.getUser()), // requires you to have a UserDTO(User user) constructor
                cart.getItems(),
                cart.getTotal(),
                cart.getStatus());
    }

    /**
     * API to get the user's cart
     * 
     * @param userRequest UserRequest containing the user id
     * @return ResponseEntity containing the cart object
     */
    @PostMapping("/getCart")
    public CartResponse getCart(@RequestBody UserRequest userRequest) {
        CartResponse userCart = cartService.getCart(userRequest.getUserId())
                .map(this::mapToResponse)
                .orElseGet(() -> CartResponse.builder()
                        .id(0L)
                        .user(new UserDTO())
                        .items(List.of())
                        .total(BigDecimal.ZERO)
                        .status(CartStatus.EMPTY)
                        .build());
        return userCart;
    }

    /**
     * API to get the list of user addresses
     * 
     * @param userRequest UserRequest containing the user id
     * @return ResponseEntity containing the list of UserAddress objects
     */
    @PostMapping("/getUserAddresses")
    public List<UserAddress> getUserAddresses(@RequestBody UserRequest userRequest) {
        return addressService.getUserAddresses(userRequest.getUserId());
    }

    /**
     * API to remove a user address
     * 
     * @param userId    the user id
     * @param addressId the address id to remove
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
    @PostMapping("/removeUserAddress")
    public ResponseEntity<EcommResponse> removeUserAddres(
            @RequestParam Long userId,
            @RequestParam Long addressId) {

        addressService.removeUserAddress(userId, addressId);
        return ResponseEntity.ok(EcommResponse.builder()
                .responseCode(EcommUtils.ADDRESS_DELETED_CODE)
                .responseMessage(EcommUtils.ADDRESS_DELETED_MESSAGE)
                .build());
    }

    /**
     * API to add a user address
     * 
     * @param userAddress UserAddressDTO containing the address details
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
    @PostMapping("/addUserAddress")
    public ResponseEntity<EcommResponse> addUserAddres(@RequestBody UserAddressDTO userAddress) {
        addressService.addUserAddress(userAddress);
        return ResponseEntity.ok(EcommResponse.builder()
                .responseCode(EcommUtils.ADDRESS_ADDED_CODE)
                .responseMessage(EcommUtils.ADDRESS_ADDED_MESSAGE)
                .build());
    }

    /**
     * API to update a user address
     * 
     * @param addressId   the id of the address to update
     * @param userAddress UserAddressDTO containing the updated address details
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
    @PutMapping("/addUserAddress")
    public ResponseEntity<EcommResponse> updateUserAddres(@RequestParam Long addressId,
            @RequestBody UserAddressDTO userAddress) {
        addressService.updateUserAddress(addressId, userAddress);
        return ResponseEntity.ok(EcommResponse.builder()
                .responseCode(EcommUtils.ADDRESS_UPDATED_CODE)
                .responseMessage(EcommUtils.ADDRESS_UPDATED_MESSAGE)
                .build());
    }

    /**
     * API to generate an order
     * 
     * @param orderRequest OrderRequest containing the user id, cart id and address
     *                     id
     * @return ResponseEntity containing the EcommResponse object with success
     *         message
     */
    @PostMapping("/generateOrder")
    public Map<Long, EcommResponse> generateOrder(@RequestBody OrderRequest orderRequest) {
        Long orderId = orderService.generateOrder(orderRequest);
        return Map.of(orderId, EcommResponse.builder()
                .responseCode(EcommUtils.ORDER_GENERATED_CODE)
                .responseMessage(EcommUtils.ORDER_GENERATED_MESSAGE)
                .build());
    }
}
