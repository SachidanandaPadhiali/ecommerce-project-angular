package com.ecommerce.angular.repo;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.angular.entity.Product;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    /**
     * Saves a product to the repository.
     *
     * @param product The product to be saved.
     * @return The saved product entity.
     */
    Product save(Product product);

    /**
     * Finds a product by its ID.
     *
     * @param productId the ID of the product
     * @return the product if found, otherwise null
     */
    Product findProductById(Long productId);

    @Query("SELECT p FROM Product p WHERE p.category = :category")
    List<Product> findProductByCategory(String category);
}
