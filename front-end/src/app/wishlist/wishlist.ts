import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { UserService } from '../services/user-service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCard, CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  products: Product[] = [];
  prodIds: number[] = [];
  loading: boolean = true;
  wished: boolean = false;
  wishList: Set<number> = new Set();
  userId: number = 0;
  error: string = '';

  constructor(private productService: ProductService, private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

    this.userService.getWishList(this.userId).subscribe({
      next: (data) => {
        this.products = data;
        this.wishList = new Set(this.products.map(p => Number(p.id)));
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
  }

  toggleWish(prodId: number) {
    if (!prodId) return;

    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    const isCurrentlyWished = this.wishList.has(prodId);

    console.log(`Toggling wish for product ID: ${prodId}, currently wished: ${isCurrentlyWished}`);

    if (isCurrentlyWished) {
      // Remove from UI
      this.wishList.delete(prodId);
      this.userService.removeFromWishList(this.userId, prodId).subscribe({
        next: () => console.log('Removed from wishlist'),
        error: (err) => console.error('Error removing:', err)
      });
    } else {
      // Add to UI
      const updated = new Set(this.wishList);
      updated.add(prodId);
      this.wishList = updated;
      this.userService.wishProduct(this.userId, prodId).subscribe({
        next: () => console.log('Added to wishlist'),
        error: (err) => console.error('Error adding:', err)
      });
    }

    this.cdr.detectChanges();
  }
}
