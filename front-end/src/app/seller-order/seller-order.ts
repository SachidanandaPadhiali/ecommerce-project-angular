import { ChangeDetectorRef, Component, OnInit, ElementRef, HostListener, ViewChildren, QueryList, viewChildren } from '@angular/core';
import { Seller } from '../services/seller';
import { finalize, Observable } from 'rxjs';
import { SellerOrderModel } from '../models/SellerOrder.model';
import { CommonModule } from '@angular/common';

type Section = 'PENDING' | 'RECIEVED' | 'CANCELLED' | 'SHIPPED';

@Component({
  selector: 'app-seller-order',
  imports: [CommonModule],
  templateUrl: './seller-order.html',
  styleUrl: './seller-order.css'
})
export class SellerOrder implements OnInit {

  sellerId: number = 0;
  isLoadingOrders = true;
  sellerOrders$!: Observable<SellerOrderModel[]>;
  active: Section = 'PENDING';
  orderStatus: string[] = ['PENDING', 'RECIEVED', 'CANCELLED', 'SHIPPED'];

  showShippingAddress: boolean = false;
  activeShippingAddress: number | null = null;

  @ViewChildren('popupRef') popupRefs!: QueryList<ElementRef>;
  @ViewChildren('triggerRef') triggerRefs!: QueryList<ElementRef>;

  sections: { id: Section; label: string; count: number }[] = [
    { id: 'PENDING', label: 'Pending', count: 0 },
    { id: 'RECIEVED', label: 'Unshipped', count: 0 },
    { id: 'CANCELLED', label: 'Cancelled', count: 0 },
    { id: 'SHIPPED', label: 'Shipped', count: 0 },
  ];

  constructor(private sellerService: Seller, private cdRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders() {
    const seller = JSON.parse(localStorage.getItem('seller') || '{}');
    this.sellerId = seller?.id;

    if (!this.sellerId) {
      console.warn('No sellerId found in localStorage.');
      return;
    }

    this.isLoadingOrders = true;
    this.sellerOrders$ = this.sellerService.getSellerOrders(this.sellerId).pipe(
      finalize(() => this.isLoadingOrders = false)
    );

    this.sellerOrders$.forEach(order => console.log(order));
    this.sellerOrders$.forEach(order => {
      this.sections.forEach(section => {
        section.count = order.filter(o => o.item.status === section.id).length;
      });
    });
    this.cdRef.detectChanges();
  }
  /**
   * Select a section in the user profile.
   * @param section - one of basic, shipping, orders, or personalization
   */
  select(status: string) {
    this.active = status as Section;
    console.log('showing ', status, ' orders');
  }

  /**
   * Whether the given section is currently active.
   * @param id - one of basic, shipping, orders, or personalization
   * @returns true if the given section is active, false otherwise
   */
  isActive(id: string) {
    return this.active === id;
  }

  /**
   * Toggles the popup for the given shipping address.
   * If the popup is already open for the given index, it closes the popup.
   * @param index The index of the shipping address to show/hide
   */
  showAddress(index: number) {
    this.activeShippingAddress = this.activeShippingAddress === index ? null : index;
  }

  hideAddress() {
    this.activeShippingAddress = null;
  }

  showStatus(index: number) {

  }

  closePopup() {
    this.activeShippingAddress = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInsidePopup = this.popupRefs.some(ref =>
      ref.nativeElement.contains(target)
    );

    const clickedInsideTrigger = this.triggerRefs.some(ref =>
      ref.nativeElement.contains(target)
    );

    if (!clickedInsidePopup && !clickedInsideTrigger) {
      this.closePopup();
    }
  }

}
