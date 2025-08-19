import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UserAddress } from '../models/UserAddress.model';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatOptionModule],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css'
})
export class AddressForm implements OnInit {
  addressForm: FormGroup;
  @Output() formSubmit = new EventEmitter<FormGroup>();

  countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' }
  ];

  statesByCountry: any = {
    IN: ['Odisha', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    US: ['California', 'Texas', 'New York'],
    CA: ['Ontario', 'Quebec', 'British Columbia']
  };

  states: string[] = [];

  addressFormData: UserAddress = {
    userId: 0, userName: '', phoneNumber: '', country: '', state: '',
    flatNo: '', addressLine1: '', addressLine2: '', city: '', zipCode: '', default: false
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddressForm>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addressForm = this.fb.group({
      userName: [this.data?.userName || '', Validators.required],
      phoneNumber: [this.data?.phoneNumber || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      flatNo: [this.data?.flatNo || '', Validators.required],
      addressLine1: [this.data?.addressLine1 || '', Validators.required],
      addressLine2: [this.data?.addressLine2 || ''],
      city: [this.data?.city || '', Validators.required],
      state: [this.data?.state || '', Validators.required],
      zipCode: [this.data?.zipCode || '', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      country: [this.data?.country || '', Validators.required],
      isDefault: [this.data?.isDefault || false]
    });
  }

  ngOnInit() {
    // When country changes → update states
    this.addressForm.get('country')?.valueChanges.subscribe(countryCode => {
      this.states = this.statesByCountry[countryCode] || [];
      this.addressForm.get('state')?.reset(); // reset state selection
    });
  }

  onSave(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.addressFormData = this.addressForm.value;
    this.dialogRef.close(this.addressFormData);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
