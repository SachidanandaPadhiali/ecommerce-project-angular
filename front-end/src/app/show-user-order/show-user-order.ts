import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderModel } from '../models/OrderModel.model';


@Component({
  selector: 'app-show-user-order',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatOptionModule],
  templateUrl: './show-user-order.html',
  styleUrl: './show-user-order.css',
  encapsulation: ViewEncapsulation.None
})
export class ShowUserOrder implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderModel>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedOrder: OrderModel }
  ) { }
  ngOnInit() {
    console.log('Received order data:', this.data);
  }

  onOk(): void {
    this.dialogRef.close(false);
  }
}
