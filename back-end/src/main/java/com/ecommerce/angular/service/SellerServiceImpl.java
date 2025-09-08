/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.service;

import com.ecommerce.angular.dto.EcommResponse;
import com.ecommerce.angular.dto.OrderStatus;
import com.ecommerce.angular.dto.ProductDTO;
import com.ecommerce.angular.dto.SellerOrdersDTO;
import com.ecommerce.angular.dto.SellerRequest;
import com.ecommerce.angular.entity.OrderItem;
import com.ecommerce.angular.entity.Product;
import com.ecommerce.angular.entity.SellerItems;
import com.ecommerce.angular.entity.SellerOrders;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.entity.UserOrders;
import com.ecommerce.angular.repo.OrderItemRepo;
import com.ecommerce.angular.repo.OrderRepo;
import com.ecommerce.angular.repo.ProductRepo;
import com.ecommerce.angular.repo.SellerItemRepo;
import com.ecommerce.angular.repo.SellerOrdersRepo;
import com.ecommerce.angular.repo.SellerRepo;
import com.ecommerce.angular.utils.EcommUtils;
import java.util.ArrayList;
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

        @Autowired
        SellerOrdersRepo sellerOrdersRepo;

        @Autowired
        OrderRepo orderRepo;

        @Autowired
        OrderItemRepo orderItemRepo;

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
        public EcommResponse updateProduct(Long id, ProductDTO updatedProduct) {
                Product existingProduct = productRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                existingProduct.setName(updatedProduct.getName());
                existingProduct.setDescription(updatedProduct.getDescription());
                existingProduct.setPrice(updatedProduct.getPrice());
                existingProduct.setDiscPrice(updatedProduct.getDiscPrice());
                existingProduct.setImageUrl(updatedProduct.getImageUrl());
                existingProduct.setCategory(updatedProduct.getCategory());
                existingProduct.setQuantity(updatedProduct.getQuantity());
                existingProduct.setBrand(updatedProduct.getBrand());
                existingProduct.setColor(updatedProduct.getColor());

                productRepo.save(existingProduct);

                return EcommResponse.builder()
                                .responseCode(EcommUtils.PRODUCT_UPDATED_CODE)
                                .responseMessage(EcommUtils.PRODUCT_UPDATED_MESSAGE)
                                .build();
        }

        @Override
        public EcommResponse deleteProduct(Long productId) {
                Product existingProduct = productRepo.findById(productId)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                existingProduct.setQuantity(-1);
                productRepo.save(existingProduct);

                return EcommResponse.builder()
                                .responseCode(EcommUtils.PRODUCT_DELETED_CODE)
                                .responseMessage(EcommUtils.PRODUCT_DELETED_MESSAGE)
                                .build();
        }

        @Override
        public List<Product> getProducts(Long sellerId) {
                return sellerRepo.findProductsBySellerId(sellerId);
        }

        @Override
        public List<SellerOrdersDTO> getSellerOrders(Long sellerId) {
                List<SellerOrders> sellerOrders = sellerOrdersRepo.findBySellerId(sellerId);
                List<SellerOrdersDTO> sellerOrderDetails = new ArrayList<SellerOrdersDTO>();

                for (SellerOrders sellerOrder : sellerOrders) {
                        System.out.println(sellerOrder);
                        UserOrders order = orderRepo.findById(sellerOrder.getUserOrder().getId())
                                        .orElseThrow(() -> new RuntimeException("Order not found"));
                        for (OrderItem orderItem : order.getItems()) {
                                SellerOrdersDTO orderData = SellerOrdersDTO.builder()
                                                .id(sellerOrder.getId())
                                                .orderId(order.getId())
                                                .item(orderItem)
                                                .status(orderItem.getStatus())
                                                .shippingAddress(order.getShippingAddress())
                                                .build();

                                sellerOrderDetails.add(orderData);
                        }
                }
                return sellerOrderDetails;
        }

        @Override
        public EcommResponse updateOrderStatus(SellerRequest request) {

                UserOrders order = orderRepo.findById(request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order Item not found"));

                System.out.println("Order found: " + order);
                
                OrderItem orderItem = orderItemRepo.findByIdAndOrderId(request.getOrderItemId(), request.getOrderId());
                
                System.out.println("Order Item found: " + orderItem);

                orderItem.setStatus(request.getStatus());
                orderItemRepo.save(orderItem);

                Boolean isPartiallyShipped = false;
                for (OrderItem item : order.getItems()) {
                        if (item.getStatus() != OrderStatus.PENDING) {
                                isPartiallyShipped = true;
                        }
                }
                if (isPartiallyShipped) {
                        order.setStatus(OrderStatus.PARTIALLYSHIPPED);
                        orderRepo.save(order);
                }
                return EcommResponse.builder()
                                .responseCode(EcommUtils.ORDER_STATUS_UPDATED_CODE)
                                .responseMessage(EcommUtils.ORDER_STATUS_UPDATED_MESSAGE)
                                .build();
        }
}
