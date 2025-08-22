import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { CartEntry } from '../models/CartEntry.model';
import { Cart } from '../models/Cart.model';
import { UserAddress } from '../models/UserAddress.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  loading: boolean = true;

  //setting up basic variables
  userId: number = 0;
  error: string = '';

  cancelOrder = faClose;
  placeOrder = faCheck;

  //Sections of checkout process
  sections = [
    { id: 0, label: 'Delivery Address' },
    { id: 1, label: 'Payment Method' },
    { id: 2, label: 'Review Your Order' }
  ];

  //setting up animation
  activeIndex = 0;  // start at first step
  progressWidth = 0;
  private animationFrame: number | null = null;

  //setting up required cart variables
  userCart: Set<CartEntry> = new Set();
  cartItems: Set<number> = new Set();
  curUserCart: Cart | null = null;
  cartMap = new Map<number, number>();
  cartProductIds: Set<number> = new Set();
  cartCount: number = 0;
  deliveryCharges: number = 100;
  convinienceFee: number = 7;

  //Address Selection
  userAddresses: UserAddress[] = [];
  selectedAddress: UserAddress | undefined = {
    userId: 0, userName: '', phoneNumber: '', country: '', state: '',
    flatNo: '', addressLine1: '', addressLine2: '', city: '', zipCode: '', default: false
  };

  // payment method selection
  paymentOption: string = 'cod';
  upiPaymentOption: string = 'gpay';

  //shipping method selecetion
  shippingMethod: string = 'standard';
  shippingDays: number = 7;
  
  // setting up the mobile view
  isMobileView = window.innerWidth < 768;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileView = event.target.innerWidth < 768;
  }

  constructor(private userService: UserService, private cdr: ChangeDetectorRef, private ngZone: NgZone, private commonModule: CommonModule) { }

  ngOnInit(): void {
    this.userId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);
    this.loadCart();
    this.loadAddresses();
    this.setInitialProgress();
  }

  reViewOrder() {
    console.log(this.userCart);
    console.log(this.cartItems);
    console.log(this.curUserCart);
    console.log(this.cartCount, this.deliveryCharges, this.convinienceFee);
    console.log(this.selectedAddress);
    console.log(this.paymentOption, this.upiPaymentOption);
  }

  loadCart() {
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

  loadAddresses() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?.id;

    if (!this.userId) {
      console.warn('No userId found in localStorage.');
      return;
    }

    this.userService.getUserAddresses(this.userId).subscribe(
      (addresses) => {
        this.ngZone.run(() => {
          this.userAddresses = [...addresses]; // triggers view update
          this.cdr.detectChanges();

          const defaultAddress = this.userAddresses.find(address => address.default === true);
          this.selectedAddress = defaultAddress;
        });
      },
      (error) => console.error('Error loading addresses:', error)
    );
  }

  selectAddress(address: UserAddress) {
    this.selectedAddress = address;
  }

  selectPaymentOption(value: string) {
    this.paymentOption = value;
    if (value === 'cod') {
      this.convinienceFee = 7;
    }
    if (value !== 'cod') {
      this.convinienceFee = 0;
    }
    this.cdr.detectChanges();
  }

  selectUPIPaymentOption(value: string) {
    this.upiPaymentOption = value;
    console.warn(value, this.upiPaymentOption);
    this.cdr.detectChanges();
  }

  isActive(id: number) {
    return this.activeIndex === id;
  }
  setActive(id: number) {
    this.activeIndex = id;
  }

  nextStep() {
    if (this.activeIndex === 1) {
      if (this.paymentOption === 'upi' && this.upiPaymentOption === '') {
        console.warn(this.upiPaymentOption);
        this.error = 'Please Choose Payment Option';
        return;
      }
    }
    if (this.activeIndex < this.sections.length - 1) {
      this.activeIndex++;
      console.warn("moving to", this.activeIndex, this.sections.length);
      this.animateProgress();
    }
  }
  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.animateProgress();
    }
  }

  private setInitialProgress() {
    // map index -> percentage
    const targetWidth = (this.activeIndex / (this.sections.length - 1)) * 100;
    this.progressWidth = targetWidth; // directly set without animation
  }

  private animateProgress() {
    const targetWidth = (this.activeIndex / (this.sections.length - 1)) * 100;
    const startWidth = this.progressWidth;
    const duration = 600;
    const startTime = performance.now();

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