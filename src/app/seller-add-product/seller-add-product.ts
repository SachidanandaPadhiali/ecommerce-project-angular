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

  product: Product = {
    sellerId: this.sellerId,
    name: '',
    price: 0,
    category: '',
    description: '',
    quantity: 0
  };

  constructor(private fb: FormBuilder, private productService: ProductService, private cd: ChangeDetectorRef, private ngZone: NgZone, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.headingType = 'updateProduct';
        this.productId = id;

        this.productService.getProductById(this.productId!).subscribe((prod: Product) => {
          console.log("Fetched product:", prod);

          this.productForm.patchValue({
            name: prod.name,
            price: prod.price,
            category: prod.category,
            description: prod.description,
            quantity: prod.quantity
          });
        });
      }
    });
  }

  /*  submit() {
      const seller = JSON.parse(localStorage.getItem('seller') || '{}');
      this.sellerId = seller?.id;
  
      if (this.sellerId) {
        this.product.sellerId = this.sellerId;
  
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
      } else {
        this.errorMessage = 'Seller not logged in!';
      }
    }*/

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
      sellerId: this.sellerId,
      name: '',
      price: 0,
      category: '',
      description: '',
      quantity: 0
    };
  }
}