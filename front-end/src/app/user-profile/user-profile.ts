import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { UserAddress } from '../models/UserAddress.model';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {

  userId: number = 0;
  userAddresses: UserAddress[] = [];

  constructor(private userService: UserService, private dialog: MatDialog, private ngZone: NgZone, private cdRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?.id;
    this.userService.getUserAddresses(this.userId).subscribe(
      (addresses) => {
        console.log('Received addresses:', addresses);
        this.ngZone.run(() => {
          this.userAddresses = [...addresses]; // triggers view update
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
          next: () => {
            // success – UI already updated
          },
          error: (err) => {
            console.error('Delete failed:', err);
            // rollback
            this.userAddresses = oldAddresses;
          }
        });
      }
    });
  }

}
