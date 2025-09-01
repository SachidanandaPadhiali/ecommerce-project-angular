/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author sachidananda
 */
@Entity
@Table(name = "Order_Item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private UserOrders order;

    @ManyToOne
    private Product product;

    private int quantity;
    private double price;

    @ManyToOne
    @JoinColumn(name = "seller_order_id", nullable = false) // Refers to SellerOrders
    @JsonBackReference("seller-items")
    private SellerOrders sellerOrder;

    @Override
    public String toString() {
        return "CartItem{" + "id="
                + id + ", cart=" + order + ", product=" + product.getName() + ", quantity=" + quantity + ", price="
                + price
                + '}';
    }

}
