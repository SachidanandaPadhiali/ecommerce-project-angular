import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './seller-add-product.html',
  styleUrl: './seller-add-product.css'
})
export class SellerAddProduct implements OnInit {
  successMessage: string | undefined;
  errorMessage: string | undefined;

  sellerId: string = "";
  headingType: String = 'addProduct';

  productForm!: FormGroup;
  productId: string | null = null;

  /**
   * Represents a product to be added by the seller.
   *
   * @property {string} sellerId - The unique identifier of the seller.
   * @property {string} name - The name of the product.
   * @property {number} price - The original price of the product.
   * @property {number} discPrice - The discounted price of the product.
   * @property {string} category - The category to which the product belongs.
   * @property {string} description - A detailed description of the product.
   * @property {string} imageUrl - The URL of the product's image.
   * @property {string} brand - The brand of the product.
   * @property {string} color - The color of the product.
   * @property {number} rating - The average rating of the product.
   * @property {number} quantity - The available quantity of the product.
   */
  product: Product = {
    sellerId: '',
    name: '',
    description: '',
    price: 0,
    discPrice: 0,
    category: '',
    imageUrl: '',
    brand: '',
    color: '',
    rating: 0.0,
    quantity: 0
  };

  constructor(private fb: FormBuilder, private productService: ProductService, private cd: ChangeDetectorRef, private ngZone: NgZone, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      discPrice: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      quantity: ['', Validators.required],
      brand: ['', Validators.required],
      color: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.headingType = 'updateProduct';
        this.productId = id;

        this.productService.getProductById(this.productId!).subscribe((prod: Product) => {
          this.productForm.patchValue({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            discPrice: prod.discPrice,
            category: prod.category,
            imageUrl: prod.imageUrl,
            quantity: prod.quantity,
            brand: prod.brand,
            color: prod.color
          });
        });
      }
    });
  }

  submit() {
    const seller = JSON.parse(localStorage.getItem('seller') || '{}');
    this.sellerId = seller?.id;

    if (!this.sellerId) {
      this.errorMessage = 'Seller not logged in!';
      return;
    }

    const formData = this.productForm.value;
    const product: Product = {
      ...formData,
      sellerId: this.sellerId,
      id: this.productId || undefined
    };

    if (this.productId) {
      this.productService.updateProduct(product).subscribe(() => {
        this.successMessage = 'Product updated successfully!';
        this.cd.detectChanges();

        setTimeout(() => {
          this.ngZone.run(() => {
            this.successMessage = undefined;
            this.cd.detectChanges();
            this.router.navigate(['/seller-home']);
          });
        }, 2000);
      });
    } else {
      this.productService.addProduct(product).subscribe(() => {
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
  }

  resetForm() {
    this.product = {
      sellerId: '',
      name: '',
      description: '',
      price: 0,
      discPrice: 0,
      category: '',
      imageUrl: '',
      brand: '',
      color: '',
      rating: 0.0,
      quantity: 0
    };
  }
}