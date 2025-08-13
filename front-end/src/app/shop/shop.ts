import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { UserService } from '../services/user-service';
import { ProductCard } from '../product-card/product-card';
import { Cart } from '../models/Cart.model';
import { forkJoin } from 'rxjs';

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
  curUserCart: Cart | null = null;
  cartMap = new Map<number, number>();
  cartProductIds: Set<number> = new Set();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    this.userService.getWishList(this.userId).pipe(
      switchMap((wishlistData) => {
        const prodIds = wishlistData.map(entry => entry.id).flat();
        this.wishList = new Set(prodIds.map(id => Number(id)));

        return this.route.paramMap;
      }),
      switchMap((params: ParamMap) => {
        this.category = params.get('name') || '';
        this.loading = true;

        return forkJoin({
          products: this.productService.getProductsByCategory(this.category),
          cart: this.userService.getUserCart(this.userId)
        });
      })
    ).subscribe(({ products, cart }) => {
      const cartMap = new Map<number, number>();
      this.cartProductIds = new Set(cart.items.map(i => i.product?.id ?? 0));

      cart.items.forEach(item => {
        cartMap.set(item.product?.id ?? 0, item.quantity ?? 0);
      });

      this.products = products.map(prod => ({
        ...prod,
        cartCount: cartMap.get(prod.id ?? 0) ?? 0
      }));

      this.loading = false;
      this.cdr.detectChanges();
    }, err => {
      console.error(err);
      this.loading = false;
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
        console.log(`Added product ID ${productId} to cart successfully`, response);
        this.cartProductIds.add(productId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
    this.cdr.detectChanges();
  }
}