import { Component, Input, ElementRef, HostListener, ViewChildren, QueryList } from '@angular/core';
import { SellerOrderModel } from '../models/SellerOrder.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-order-page',
  imports: [CommonModule],
  templateUrl: './seller-order-page.html',
  styleUrl: './seller-order-page.css'
})
export class SellerOrderPage {
  @Input() ordersBySection: SellerOrderModel[] = [];

  showShippingAddress: boolean = false;
  activeShippingAddress: number | null = null;

  @ViewChildren('popupRef') popupRefs!: QueryList<ElementRef>;
  @ViewChildren('triggerRef') triggerRefs!: QueryList<ElementRef>;

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
