import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Seller } from '../services/seller';
import { finalize, Observable } from 'rxjs';
import { SellerOrderModel } from '../models/SellerOrder.model';
import { CommonModule } from '@angular/common';
import { SellerOrderPage } from "../seller-order-page/seller-order-page";

type Section = 'PENDING' | 'RECIEVED' | 'CANCELLED' | 'SHIPPED';

@Component({
  selector: 'app-seller-order',
  imports: [CommonModule, SellerOrderPage],
  templateUrl: './seller-order.html',
  styleUrl: './seller-order.css'
})
export class SellerOrder implements OnInit {

  sellerId: number = 0;
  isLoadingOrders = true;
  sellerOrders$!: Observable<SellerOrderModel[]>;
  active: Section = 'PENDING';
  orderStatus: string[] = ['PENDING', 'RECIEVED', 'CANCELLED', 'SHIPPED'];

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

  filterBySection(orders: SellerOrderModel[], sectionId: string): SellerOrderModel[] {
    return orders.filter(order => order.status === sectionId);
  }

}
