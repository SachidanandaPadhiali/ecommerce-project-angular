import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { UserService } from '../services/user-service';
import { ProductCard } from '../product-card/product-card';
import { Cart } from '../models/Cart.model';

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
  wishList: Set<number> = new Set();
  userId: number = 0;
  error = '';
  cartMap = new Map<number, number>();

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
        const prodIds = data.map(entry => entry.id).flat();
        this.wishList = new Set(prodIds.map(id => Number(id))); // ✅ store as strings*/
        this.route.paramMap.pipe(
          switchMap((params: ParamMap) => {
            this.loading = true;
            this.category = params.get('name') || '';

            return this.productService.getProductsByCategory(this.category);
          })
        ).subscribe({
          next: (data: Product[]) => {

            this.products = data.map(p => ({ ...p, cartCount: 0 }));
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

  toggleWish(productId: number) {
    if (!productId) return;

    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

    const isCurrentlyWished = this.wishList.has(productId);

    console.log(`Toggling wish for product ID: ${productId}, currently wished: ${isCurrentlyWished}`);

    if (this.wishList.has(productId)) {
      this.wishList.delete(productId);
      this.userService.removeFromWishList(this.userId, productId).subscribe({
        next: () => console.log(`Added to wishlist: ${productId}`),
        error: (err) => console.error('Error adding to wishlist', err)
      });
      console.log(`Removed from wishlist: ${productId}`);
    } else {
      this.wishList.add(productId);
      console.log(`Added to wishlist: ${productId}`);
      this.userService.wishProduct(this.userId, productId).subscribe({
        next: () => console.log(`Added to wishlist: ${productId}`),
        error: (err) => console.error('Error adding to wishlist', err)
      });
    }

    this.cdr.detectChanges();
  }

  addProductToCart(productId: number): void {
    console.log(`shop.ts Adding product ID ${productId} to cart`);

    this.userService.addToCart(this.userId, productId).subscribe({
      next: (response: Cart) => {
        console.log(response);
        const product = this.products.find(p => p.id === response.productId);
        if (product) {
          product.cartCount = response.quantity;
        }
         console.log(product);
     },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
  }
}