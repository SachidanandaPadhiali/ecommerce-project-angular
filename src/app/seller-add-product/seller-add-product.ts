import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-seller-add-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-add-product.html',
  styleUrl: './seller-add-product.css'
})
export class SellerAddProduct {
  product = {
    name: '',
    price: 0,
    category: '',
    description: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  handleAddProduct(): void {
    this.http.post('http://localhost:3000/products', this.product).subscribe({
      next: (res) => {
        this.successMessage = 'Product added successfully!';
        this.product = { name: '', price: 0, category: '', description: '' };
      },
      error: (err) => {
        this.errorMessage = 'Failed to add product';
      }
    });
  }

}
