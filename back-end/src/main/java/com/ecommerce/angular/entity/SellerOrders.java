/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import java.util.List;
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

    @OneToMany(mappedBy = "sellerOrder", cascade = CascadeType.ALL)
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
