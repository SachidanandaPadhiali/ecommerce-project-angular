/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.ProductDTO;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.SellerItems;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.repo.ProductRepo;
import com.ecommerce.angular.repo.SellerItemRepo;
import com.ecommerce.angular.repo.SellerRepo;
import com.ecommerce.angular.utils.EcommUtils;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author sagar
 */
@Service
public class SellerServiceImpl implements SellerService {

    @Autowired
    SellerRepo sellerRepo;

    @Autowired
    ProductRepo productRepo;

    @Autowired
    SellerItemRepo sellerItemRepo;

    @Override
    public EcommResponse addProduct(ProductDTO product) {
        Product newProduct = Product.builder()
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discPrice(product.getDiscPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .rating(product.getRating())
                .brand(product.getBrand())
                .color(product.getColor())
                .build();

        Product savedProduct = productRepo.save(newProduct);
        User seller = (User) sellerRepo.findById(product.getSellerId()).orElse(null);
        SellerItems sellerItem = SellerItems.builder()
                .product(savedProduct)
                .seller(seller)
                .build();

        sellerItemRepo.save(sellerItem);

        return EcommResponse.builder()
                .responseCode(EcommUtils.PRODUCT_ADDED_CODE)
                .responseMessage(EcommUtils.PRODUCT_ADDED_MESSAGE)
                .build();
    }

    @Override
    public EcommResponse updateProduct(ProductDTO product) {
        return EcommResponse.builder()
                .responseCode(EcommUtils.ACCOUNT_EXISTS_CODE)
                .responseMessage(EcommUtils.ACCOUNT_EXISTS_MESSAGE)
                .build();
    }

    @Override
    public EcommResponse deleteProduct(ProductDTO product) {
        return EcommResponse.builder()
                .responseCode(EcommUtils.ACCOUNT_EXISTS_CODE)
                .responseMessage(EcommUtils.ACCOUNT_EXISTS_MESSAGE)
                .build();
    }

    @Override
    public List<Product> getProducts(Long sellerId) {
        return sellerRepo.findProductsBySellerId(sellerId);
    }

}
