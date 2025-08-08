package com.ecommerce.angular.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.angular.entity.SellerItems;

public interface SellerItemRepo extends JpaRepository<SellerItems, Long> {

    /**
     * Saves a seller item to the repository.
     *
     * @param sellerItem The seller item to be saved.
     * @return The saved seller item entity.
     */
    SellerItems save(SellerItems sellerItem);
}