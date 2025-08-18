import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatSelectModule, MatOptionModule],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css'
})
export class AddressForm implements OnInit {
  addressForm: FormGroup;
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

  addressData = {
    name: '', phoneNumber: '', country: '', state: '',
    addressLine1: '', addressLine2: '', city: '', pin: '',
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddressForm>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.addressForm = this.fb.group({
      country: [''],
      state: ['']
    });

    // When country changes → update states
    this.addressForm.get('country')?.valueChanges.subscribe(countryCode => {
      this.states = this.statesByCountry[countryCode] || [];
      this.addressForm.get('state')?.reset(); // reset state selection
    });
  }

  onSave(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
