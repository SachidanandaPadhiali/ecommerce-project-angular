import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  imports: [CommonModule],
  templateUrl: './seller-home.html',
  styleUrl: './seller-home.css'
})
export class SellerHome implements OnInit {
  errorMessage: string | undefined;

  products: Product[] = [];
  sellerId: String = "";
  constructor(private productService: ProductService, private cd: ChangeDetectorRef, private ngZone: NgZone, private router:Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const seller = JSON.parse(localStorage.getItem('seller') || '{}');
    this.sellerId = seller?.id;
    if (this.sellerId) {
      this.productService.viewProductBySeller(this.sellerId).subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            this.products = data;
            this.cd.detectChanges();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.errorMessage = 'Failed to load products!';
            this.cd.detectChanges();
          });
        }
      });

    }
  }

  editProduct(productId: string): void {
    this.router.navigate(['/seller-product', productId]);
  }
  removeProduct(id: string) {
    this.productService.removeProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

}
