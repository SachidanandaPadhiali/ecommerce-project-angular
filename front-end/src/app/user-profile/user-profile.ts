import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { UserAddress } from '../models/UserAddress.model';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user-service';
import { AddressForm } from '../address-form/address-form';
import { OrderModel } from '../models/OrderModel.model';
import { finalize, Observable } from 'rxjs';

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
  userOrders$!: Observable<OrderModel[]>;
  active: Section = 'basic';
  showForm: boolean = false;
  isLoadingOrders = true;

  sections: { id: Section; label: string }[] = [
    { id: 'basic', label: 'Basic info' },
    { id: 'shipping', label: 'Shipping & billing' },
    { id: 'orders', label: 'Orders' },
    { id: 'personalization', label: 'Personalization' },
  ];

  constructor(private userService: UserService, private dialog: MatDialog, private ngZone: NgZone, private cdRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.loadAddresses();
  }

  /**
   * Select a section in the user profile.
   * @param section - one of basic, shipping, orders, or personalization
   */
  select(section: Section) {
    this.active = section;
    console.log('Current section:', section);
    if (this.isActive('orders')) {
      this.showOrders();
      console.log('check');
    }
  }

  /**
   * Whether the given section is currently active.
   * @param id - one of basic, shipping, orders, or personalization
   * @returns true if the given section is active, false otherwise
   */
  isActive(id: Section) {
    return this.active === id;
  }

  /**
   * Loads the user addresses from the server.
   * If there is no user id in local storage, does nothing.
   * If there is an error loading the addresses, logs an error to the console.
   * Otherwise, sets the userAddresses property to the loaded addresses and triggers a view update.
   */
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

  /**
   * Removes a user address from the server and from the local list of addresses.
   * If the user cancels the deletion, does nothing.
   * If there is an error deleting the address, logs an error to the console
   * and reverts the local list of addresses to its previous state.
   * @param addressId - the id of the address to remove
   * @param addressName - the name of the address to remove
   */
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

  /**
   * Opens the address form dialog in add mode to create a new address
   * Subscribes to the result of the dialog and if the user clicks save,
   * sends a request to the server to save the new address.
   * If successful, reloads the user addresses and triggers a view update.
   * If there is an error saving the address, logs an error to the console.
   */
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

  /**
   * Opens the address form dialog in edit mode to update an existing address
   * @param addressId The ID of the address to update
   */
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

  showOrders() {
    this.isLoadingOrders = true;
    this.userOrders$ = this.userService.getUserOrders(this.userId).pipe(
      finalize(() => this.isLoadingOrders = false)
    );
    console.log(this.userOrders$);
  }

}
