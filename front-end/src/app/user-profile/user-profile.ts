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

  constructor(private userService: UserService, private dialog: MatDialog, private ngZone: NgZone) { }
  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?.id;
    this.userService.getUserAddresses(this.userId).subscribe(
      (addresses: UserAddress[]) => {
        console.log(addresses);
        this.userAddresses = [...addresses];

        if (!addresses || this.userAddresses.length === 0) {
          console.log('No addresses found for the user.');
        }
      },
      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  removeAddress(addressId: number, addressName: string) {
    const name = addressName;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.userService.removeAddress(this.userId, addressId).subscribe((responseCode: any) => {
          this.ngZone.run(() => {
            console.log(responseCode);
            this.loadAddresses();
          });
        });
      }
    });
  }

}
