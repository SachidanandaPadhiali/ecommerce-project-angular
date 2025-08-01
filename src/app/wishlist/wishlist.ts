import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { UserService } from '../services/user-service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCard, CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  products: Product[] = [];
  prodIds: string[] = [];
  loading: boolean = true;
  wishList: Set<string> = new Set();
  userId: string = '';
  error: string = '';

  constructor(private productService: ProductService, private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    this.userService.getWishList(this.userId).subscribe({
      next: (data) => {
        this.prodIds = data.map(entry => entry.productIds).flat();
        this.productService.getProductById(this.prodIds).subscribe({
          next: (products: Product[]) => {
            this.products = products;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching products:', err);
            this.error = 'Failed to load products';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });

        console.log('Wishlist product IDs:', this.prodIds);
      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
        this.error = 'Failed to load wishlist';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  toggleWish(productId: string): void {
    if (this.wishList.has(productId)) {
      this.wishList.delete(productId);
      this.userService.removeFromWishList(this.userId, productId);
    } else {
      this.wishList.add(productId);
      this.userService.wishProduct(this.userId, productId);
    }
  }

}
