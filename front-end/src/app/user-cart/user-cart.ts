import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user-service';
import { Product } from '../models/product.model';
import { CartEntry } from '../models/CartEntry.model';
import { Cart } from '../models/Cart.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  cartCount: number = 0;
  deliveryCharges: number = 100;

  delete = faTrash;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef, private commonModule: CommonModule, private router: Router) { }

  ngOnInit(): void {
    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

    this.userService.getUserCart(this.userId).subscribe({
      next: (data: Cart) => {
        this.curUserCart = data;
        this.cartProductIds = new Set(data.items.map(i => i.product?.id ?? 0));

        this.cartMap.clear();
        this.curUserCart.items.forEach(item => {
          this.cartMap.set(item.product?.id ?? 0, item.quantity ?? 0);
          this.cartCount += item.quantity ?? 0;
        });
        this.curUserCart.totalCartCount = this.cartCount;
        if (this.curUserCart.total > 500) {
          this.deliveryCharges = 0;
        }
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

    if (!this.curUserCart || !this.curUserCart.items) return;

    const updatedItems = (this.curUserCart.items ?? []).map(item => {
      if (item.product.id === productId) {
        const newQuantity = (item.quantity ?? 0) + 1;
        return {
          ...item,
          quantity: newQuantity,
          price: item.product.discPrice * newQuantity,
          originalPrice: item.product.price * newQuantity
        };
      }
      return item;
    });

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

    this.curUserCart = {
      ...this.curUserCart,
      items: updatedItems,
      total: newTotal,
      totalCartCount: (this.curUserCart.totalCartCount ?? 0) + 1
    };

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
    if (!this.curUserCart || !this.curUserCart.items) return;

    const updatedItems = (this.curUserCart.items ?? []).map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max((item.quantity ?? 0) - 1, 0);
        return {
          ...item,
          quantity: newQuantity,
          price: item.product.discPrice * newQuantity,
          originalPrice: item.product.price * newQuantity
        };
      }
      return item;
    });

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

    this.curUserCart = {
      ...this.curUserCart,
      items: updatedItems,
      total: newTotal,
      totalCartCount: (this.curUserCart.totalCartCount ?? 0) - 1
    };

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
    this.cdr.detectChanges();
  }

  goToCheckOut(): void {
    console.warn("going to checkout");
    this.router.navigate(['/user/checkOut']);
  }

}
