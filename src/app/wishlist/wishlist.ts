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
  prodIds: string[] = [];
  loading: boolean = true;
  wished: boolean = false;
  wishList: Set<string> = new Set();
  userId: string = '';
  error: string = '';

  constructor(private productService: ProductService, private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    this.userService.getWishList(this.userId).subscribe({
      next: (data) => {
        const entry = data[0];
        this.prodIds = data.map(entry => entry.productIds).flat();

        this.wishList = new Set((entry?.productIds || []).map(id => String(id)));

        const requests = this.prodIds.map(id => this.productService.getProductById(id));
        forkJoin(requests).subscribe({
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
      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
        this.error = 'Failed to load wishlist';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  toggleWish(prodId: string) {
    if (!prodId) return;

    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    if (this.wishList.has(prodId)) {
      this.wishList.delete(prodId);
    } else {
      this.wishList.add(prodId);
    }

    this.userService.updateWishList(this.userId, Array.from(this.wishList)).subscribe();
    this.cdr.detectChanges();
  }
}
