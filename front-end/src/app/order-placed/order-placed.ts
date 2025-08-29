import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderModel } from '../models/OrderModel.model';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-order-placed',
  imports: [],
  templateUrl: './order-placed.html',
  styleUrl: './order-placed.css'
})

export class OrderPlaced implements OnInit {
  orderData: OrderModel | undefined;
  orderId: number;

  constructor(private router: Router, private userService: UserService) {
    const nav = this.router.getCurrentNavigation();
    this.orderId = nav?.extras?.state?.['orderGen'];
  }

  ngOnInit(): void {
    this.getOrderData();
  }

  getOrderData(): any {
    this.userService.getOrderData(this.orderId).subscribe({
      next: (data: OrderModel) => {
        console.log(data);
        this.orderData = data;
      },
      error: (err) => {
        console.error('Error fetching order data:', err);
      }
    });
    return this.orderData;
  }
}