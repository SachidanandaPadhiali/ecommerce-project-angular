import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user-service';
import { Product } from '../models/product.model';
import { CartEntry } from '../models/CartEntry.model';
import { Cart } from '../models/Cart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-cart',
  imports: [CommonModule, FontAwesomeModule],
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
  cartMap = new Map<number, number>();
  cartProductIds: Set<number> = new Set();

  delete = faTrash;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef, private commonModule: CommonModule) { }

  ngOnInit(): void {
    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

    this.userService.getUserCart(this.userId).subscribe({
      next: (data: Cart) => {
        this.curUserCart = data;
        this.cartProductIds = new Set(data.items.map(i => i.product?.id ?? 0));
        console.log('user-cart.ts Cart data:', this.curUserCart);

        this.cartMap.clear();
        this.curUserCart.items.forEach(item => {
          this.cartMap.set(item.product?.id ?? 0, item.quantity ?? 0);
        });
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

  addProductToCart(productId: number): void {
    // Instant local UI update
    const cartItem = this.curUserCart?.items.find(item => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity = (cartItem.quantity ?? 0) + 1;
      cartItem.price = cartItem.product.discPrice * cartItem.quantity;
      console.log(cartItem);
    }

    // Update products array so product cards update
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      prod.cartCount = (prod.cartCount ?? 0) + 1;
    }

    // Update cartMap for quick lookup
    this.cartMap.set(productId, (this.cartMap.get(productId) ?? 0) + 1);

    this.cdr.detectChanges();

    this.userService.addToCart(this.userId, productId).subscribe({
      next: (response: Cart) => {
        this.cartProductIds.add(productId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
    this.cdr.detectChanges();
  }

  removeProductFromCart(productId: number): void {
    // Instant local UI update
    const cartItem = this.curUserCart?.items.find(item => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity = Math.max((cartItem.quantity ?? 0) - 1, 0);
      cartItem.price = cartItem.product.discPrice * cartItem.quantity;
      console.log(cartItem);
    }

    // Update products array so product cards update
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      const newCount = Math.max((prod.cartCount ?? 0) - 1, 0);
      prod.cartCount = newCount;

      if (newCount === 0) {
        this.cartMap.delete(productId);        // remove from cart map
        this.cartProductIds.delete(productId); // remove from "in cart" set
      } else {
        this.cartMap.set(productId, newCount);
      }

      this.cdr.detectChanges();
    }
    this.cdr.markForCheck();

    this.userService.removeFromCart(this.userId, productId).subscribe({
      next: (response: Cart) => {
        console.log(`Removed product ID ${productId} from cart successfully`, response);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
    this.cdr.detectChanges();
  }
}
