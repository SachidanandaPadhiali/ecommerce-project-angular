/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ecommerce.angular.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 *
 * @author sagar
 */
@Controller
public class FrontEndController {

    // This matches all routes that don’t contain a dot (.)
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }

    @GetMapping({"/user/**"})
    public String redirectToAngular() {
        // Redirects to Angular dev server
        return "redirect:http://localhost:4200/user-home";
    }
}
