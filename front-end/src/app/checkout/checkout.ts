import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Product } from '../models/product.model';
import { CartEntry } from '../models/CartEntry.model';
import { Cart } from '../models/Cart.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  products: Product[] = [];
  prodIds: number[] = [];
  loading: boolean = true;

  userCart: Set<CartEntry> = new Set();
  cartItems: Set<number> = new Set();
  curUserCart: Cart | null = null;
  cartMap = new Map<number, number>();
  cartProductIds: Set<number> = new Set();

  userId: number = 0;
  error: string = '';
  cartCount: number = 0;
  deliveryCharges: number = 100;

  sections = [
    { id: 0, label: 'Delivery Address' },
    { id: 1, label: 'Payment Method' },
    { id: 2, label: 'Review Your Order' }
  ];

  activeIndex = 0;  // start at first step
  progressWidth = 0;
  private animationFrame: number | null = null;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef, private commonModule: CommonModule) { }

  ngOnInit(): void {
    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);
    this.userService.getUserCart(this.userId).subscribe({
      next: (data: Cart) => {
        this.curUserCart = data;
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

  isActive(id: number) {
    return this.activeIndex === id;
  }

  setActive(id: number) {
    this.activeIndex = id;
  }

  nextStep() {
    if (this.activeIndex < this.sections.length - 1) {
      this.activeIndex++;
      this.animateProgress();
    }
  }
  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.animateProgress();
    }
  }

  private animateProgress() {
    const targetWidth = (this.activeIndex / (this.sections.length - 1)) * 50;
    const startWidth = this.progressWidth;
    const duration = 600;
    const startTime = performance.now();

    console.log('Animating from', startWidth, 'to', targetWidth);

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.progressWidth = startWidth + (targetWidth - startWidth) * progress;

      this.cdr.detectChanges();

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }
}