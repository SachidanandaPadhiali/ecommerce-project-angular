import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-add-product.html',
  styleUrl: './seller-add-product.css'
})
export class SellerAddProduct {
  successMessage: string | undefined;
  errorMessage: string | undefined;

  product: Product = {
    name: '',
    price: 0,
    category: '',
    description: ''
  };
  constructor(private productService: ProductService, private cd: ChangeDetectorRef, private ngZone: NgZone) { }

  submit() {
    this.productService.addProduct(this.product).subscribe((result) => {
      if (result) {
        this.ngZone.run(() => {
          this.successMessage = 'Product added successfully!';
          this.cd.detectChanges();
        });

        this.resetForm();

        setTimeout(() => {
          this.ngZone.run(() => {
            this.successMessage = undefined;
            this.cd.detectChanges();
          });
        }, 3000);
      }
    });
  }

  resetForm() {
    this.product = {
      name: '',
      price: 0,
      category: '',
      description: ''
    };
  }
}