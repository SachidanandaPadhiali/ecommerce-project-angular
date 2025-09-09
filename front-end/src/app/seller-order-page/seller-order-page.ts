import { Component, Input, ElementRef, HostListener, ViewChildren, QueryList, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  @Output() statusChanged = new EventEmitter<SellerOrderModel>();
  @Output() generateInvoice = new EventEmitter<SellerOrderModel>();

  constructor(private cdRef: ChangeDetectorRef) { }
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

  /**
   * Hides the currently open shipping address popup.
   * This is called when the user clicks outside the popup
   * or when the user clicks on the close button.
   */
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

  /**
   * Emits an event to update the status of the order to 'RECIEVED'
   * @param order the order to update
   */
  confirmOrder(order: SellerOrderModel) {
    order.oldStatus = order.status;
    order.status = 'RECIEVED';
    console.log('confirming order', order);
    this.changeStatus(order, 'RECIEVED');
  }

  /**
   * Emits an event to update the status of the order to 'SHIPPED'
   * @param order the order to update
   */
  confirmShipment(order: SellerOrderModel) {
    order.oldStatus = order.status;
    order.status = 'SHIPPED';
    this.cdRef.detectChanges();
    console.log('shipping order', order);
    this.changeStatus(order, 'SHIPPED');
  }
  
  /**
   * Emits an event to update the status of the order
   * @param order the order to update
   * @param newStatus the new status of the order
   */
  changeStatus(order: SellerOrderModel, newStatus: string) {
    console.log('changing status of order', order, 'to', newStatus);
    const updatedOrder = { ...order, status: newStatus };
    this.statusChanged.emit(updatedOrder);
  }  

  generateOrderInvoice(order: SellerOrderModel) {
    console.log('emitting generate invoice for order', order);
    this.generateInvoice.emit(order);
  }
}
