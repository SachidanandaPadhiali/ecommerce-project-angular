import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Seller } from '../services/seller';

@Component({
  selector: 'app-seller-auth',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './seller-auth.html',
  styleUrl: './seller-auth.css'
})
export class SellerAuth implements OnInit {

  constructor(private newSeller: Seller, private router:Router) { }
  ngOnInit(): void { }

  seller = {
    name: '',
    email: '',
    phno: '',
    password: '',
    confirmPassword: ''
  };

  duplicateSeller: string | null = null;

  get passwordMismatch(): boolean {
    return this.seller.password !== this.seller.confirmPassword;
  }

  isPasswordValid(password: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).+$/;
    return pattern.test(password);
  }

  isPasswordLong(password: string): boolean {
    return password.length >= 8;
  }

  signUp(data: object): void {
    if (this.passwordMismatch) return;
    if (!this.isPasswordValid(this.seller.password)) return;
    if (!this.isPasswordLong(this.seller.password)) return;

    this.newSeller.checkDuplicateEmail(this.seller.email).subscribe((res) => {
      if (res.length > 0) {
        // Duplicate found
        this.duplicateSeller = 'Email already registered... Please LogIn Instead';
        return;
      }

      // No duplicate, proceed with sign-up
      this.newSeller.sellerSignUp(data).subscribe({
        next: () => {
          this.duplicateSeller = null;
          this.router.navigate(['/log-in']);
        },
        error: (err) => {
          console.error('Sign-up failed:', err);
          this.duplicateSeller = 'Registration failed';
        }
      });
    });
  }
}
