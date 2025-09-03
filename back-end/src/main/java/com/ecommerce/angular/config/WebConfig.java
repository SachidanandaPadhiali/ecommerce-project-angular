/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *
 * @author sagar
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://192.168.118.153.nip.io:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Match single-level routes like /user or /checkout
        registry.addViewController("/{spring:[a-zA-Z0-9-]+}")
                .setViewName("forward:/user-home");

        // Match nested routes like /user/checkout or /user/profile/edit
        registry.addViewController("/{spring:[a-zA-Z0-9-]+}/**{path:[a-zA-Z0-9-]+}")
                .setViewName("forward:/user-home");
    }
}
