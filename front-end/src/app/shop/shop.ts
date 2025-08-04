import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { UserService } from '../services/user-service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {
  products: Product[] = [];
  category: string = '';
  loading: boolean = true;
  wished: boolean = false;
  wishList: Set<string> = new Set();
  userId: string = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    this.userService.getWishList(this.userId).subscribe({
      next: (data) => {
        const prodIds = data.map(entry => entry.productIds).flat();
        this.wishList = new Set(prodIds.map(id => String(id)));  // ✅ store as strings
        this.route.paramMap.pipe(
          switchMap((params: ParamMap) => {
            this.loading = true;
            this.category = params.get('name') || '';

            return this.productService.getProductsByCategory(this.category);
          })
        ).subscribe({
          next: (data: Product[]) => {

            this.products = data;
            this.loading = false;
            this.cdr.detectChanges(); // ✅ Force view update
          },
          error: (err) => {
            console.error('Error fetching products:', err);
            this.products = [];
            this.loading = false;
            this.cdr.detectChanges(); // ✅ Even on error
          }
        });

      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
        this.wishList = new Set(); // Fallback
      }
    });
  }

  viewProduct(productId: string | undefined): void {
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }
    this.router.navigate(['/product', productId]);
  }

  toggleWish(prodId: string) {
    if (!prodId) return;

    this.wished = !this.wished;
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    if (this.wishList.has(prodId)) {
      this.wishList.delete(prodId);
    } else {
      this.wishList.add(prodId);
    }
    this.userService.updateWishList(this.userId, Array.from(this.wishList)).subscribe();
    this.cdr.detectChanges(); // ✅ Force view update

  }

}
