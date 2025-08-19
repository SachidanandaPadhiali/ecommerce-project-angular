import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { UserAddress } from '../models/UserAddress.model';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user-service';
import { AddressForm } from '../address-form/address-form';
import { FormGroup } from '@angular/forms';

type Section = 'basic' | 'shipping' | 'orders' | 'personalization';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {

  userId: number = 0;
  userAddresses: UserAddress[] = [];
  active: Section = 'basic';
  showForm: boolean = false;

  sections: { id: Section; label: string }[] = [
    { id: 'basic', label: 'Basic account info' },
    { id: 'shipping', label: 'Shipping & billing' },
    { id: 'orders', label: 'Order management' },
    { id: 'personalization', label: 'Personalization' },
  ];

  constructor(private userService: UserService, private dialog: MatDialog, private ngZone: NgZone, private cdRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.loadAddresses();
  }

  select(section: Section) {
    this.active = section;
  }

  isActive(id: Section) {
    return this.active === id;
  }

  loadAddresses() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?.id;

    if (!this.userId) {
      console.warn('No userId found in localStorage.');
      return;
    }

    this.userService.getUserAddresses(this.userId).subscribe(
      (addresses) => {
        this.ngZone.run(() => {
          this.userAddresses = [...addresses]; // triggers view update
          this.cdRef.detectChanges();
        });
      },
      (error) => console.error('Error loading addresses:', error)
    );
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  removeAddress(addressId: number, addressName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name: addressName }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const oldAddresses = [...this.userAddresses];

        // Force new array reference
        this.userAddresses = this.userAddresses.filter(addr => addr.id !== addressId);
        this.cdRef.detectChanges();


        this.userService.removeAddress(this.userId, addressId).subscribe({
          next: () => { },
          error: (err) => {
            console.error('Delete failed:', err);
            // rollback
            this.userAddresses = oldAddresses;
          }
        });
      }
    });
  }

  showAddressForm() {
    const dialogRef = this.dialog.open(AddressForm, {
      width: '1300px',
      maxWidth: '90vw',
      panelClass: 'address-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const savedAddress: UserAddress = result;
        savedAddress.userId = this.userId;
        console.log(savedAddress);

        this.userService.saveUserAddress(savedAddress).subscribe({
          next: (res) => {
            console.log("✅ Address saved successfully:", res);
            this.loadAddresses();
            this.cdRef.detectChanges();
          },
          error: (err) => {
            console.error("❌ Error saving address:", err);
          }
        });
      }
    });
  }

  showAddressUpdateForm(addressId: number) {
    const updateAddress = this.userAddresses.find(addr => addr.id === addressId);
    console.log(updateAddress);
    const dialogRef = this.dialog.open(AddressForm, {
      width: '1300px',
      maxWidth: '90vw',
      panelClass: 'address-dialog',
      data: updateAddress
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedAddress: UserAddress = result;
        updatedAddress.id = addressId;
        updatedAddress.userId = this.userId;
        console.log(updatedAddress);

        this.userService.updateUserAddress(updatedAddress).subscribe({
          next: (res) => {
            console.log("✅ Address saved successfully:", res);
            this.loadAddresses();
            this.cdRef.detectChanges();
          },
          error: (err) => {
            console.error("❌ Error saving address:", err);
          }
        });
      }
    });
  }
}
