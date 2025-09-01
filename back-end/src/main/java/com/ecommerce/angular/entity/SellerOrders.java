/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author sagar
 */
@Entity
@Table(name = "seller_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerOrders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User seller;

    // Link to the original UserOrders (customer order)
    @ManyToOne
    @JoinColumn(name = "user_order_id", nullable = false)
    private UserOrders userOrder;

    // Items that belong to this seller for this order
    @OneToMany(mappedBy = "sellerOrder", cascade = CascadeType.ALL)
    @JsonManagedReference("seller-items")
    private List<OrderItem> orders;

    @Override
    public String toString() {
        return "Product{"
                + "id=" + id
                + "User = " + seller
                + ", total=" + orders
                + '}';
    }
}
