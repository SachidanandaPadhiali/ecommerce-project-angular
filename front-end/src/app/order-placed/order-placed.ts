import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-placed',
  imports: [],
  templateUrl: './order-placed.html',
  styleUrl: './order-placed.css'
})
export class OrderPlaced {
  orderData: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.orderData = nav?.extras?.state?.['orderData'];
    console.log("ORDER DATA",this.orderData);
  }
}