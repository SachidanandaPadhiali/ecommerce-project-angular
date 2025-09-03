import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Seller } from '../services/seller';
import { finalize, Observable } from 'rxjs';
import { SellerOrderModel } from '../models/SellerOrder.model';
import { CommonModule } from '@angular/common';

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
    this.cdRef.detectChanges();
  }
}
