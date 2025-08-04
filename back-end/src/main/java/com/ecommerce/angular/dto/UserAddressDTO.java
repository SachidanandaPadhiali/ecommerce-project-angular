/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author sagar
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAddressDTO {

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String ZipCode;
    private String country;
    private boolean isDefault;
}
