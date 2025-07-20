import { Component, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-add-product.html',
  styleUrl: './seller-add-product.css'
})
export class SellerAddProduct {
  product = {
    name: '',
    price: 0,
    category: '',
    description: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private ngZone: NgZone, private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) { }

  handleAddProduct(form: NgForm): void {
    this.http.post('http://localhost:3000/products', this.product).subscribe({
      next: () => {
        this.successMessage = 'Product added successfully!';
        form.resetForm();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.successMessage = null;
              this.cd.detectChanges();
            });
          }, 3000);
        }

      },
      error: () => {
        this.errorMessage = 'Failed to add product!';
        setTimeout(() => {
          this.ngZone.run(() => {
            this.errorMessage = null;
          });
        }, 3000);
      }
    });
  }
}
