import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product-service';
import { UserService } from '../services/user-service';
import { Product } from '../models/product.model';
import { CartEntry } from '../models/CartEntry.model';
import { Cart } from '../models/Cart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-cart',
  imports: [CommonModule],
  templateUrl: './user-cart.html',
  styleUrl: './user-cart.css'
})
export class UserCart implements OnInit {
  products: Product[] = [];
  prodIds: number[] = [];
  loading: boolean = true;
  wished: boolean = false;
  userCart: Set<CartEntry> = new Set();
  cartItems: Set<number> = new Set();
  userId: number = 0;
  error: string = '';
  curUserCart: Cart | null = null;

  constructor(private productService: ProductService, private userService: UserService, private cdr: ChangeDetectorRef, private commonModule : CommonModule) { }

  ngOnInit(): void {
    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

    this.userService.getUserCart(this.userId).subscribe({
      next: (data: Cart) => {
        this.curUserCart = data;
        console.log('user-cart.ts Cart data:', this.curUserCart);/*
        this.userCart = new Set(data);
        this.cartItems = new Set(data.map((entry: CartEntry) => Number(entry.productId)));
        this.loading = false;*/
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.error = 'Failed to load cart';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addProductToCart(prodId: number) {
    if (!prodId) return;

    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    const isCurrentlyWished = this.cartItems.has(prodId);

    console.log(`usercart.ts adding product ${prodId}, currently added: ${isCurrentlyWished}`);

    const updated = new Set(this.cartItems);

    updated.add(prodId);
    this.cartItems = updated;
    this.userService.addToCart(this.userId, prodId).subscribe({
      next: () => console.log('user-cart.ts Added to wishlist'),
      error: (err) => console.error('Error adding:', err)
    });

    this.cdr.detectChanges();
  }
}
