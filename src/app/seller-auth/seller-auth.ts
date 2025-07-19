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

  constructor(private seller: Seller, private router:Router) { }
  ngOnInit(): void { }

  user = {
    name: '',
    email: '',
    phno: '',
    password: '',
    confirmPassword: ''
  };

  duplicateUser: string | null = null;

  get passwordMismatch(): boolean {
    return this.user.password !== this.user.confirmPassword;
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
    if (!this.isPasswordValid(this.user.password)) return;
    if (!this.isPasswordLong(this.user.password)) return;

    this.seller.checkDuplicateEmail(this.user.email).subscribe((res) => {
      if (res.length > 0) {
        // Duplicate found
        this.duplicateUser = 'Email already registered... Please LogIn Instead';
        return;
      }

      // No duplicate, proceed with sign-up
      this.seller.userSignUp(data).subscribe({
        next: () => {
          this.duplicateUser = null;
          this.router.navigate(['/log-in']);
        },
        error: (err) => {
          console.error('Sign-up failed:', err);
          this.duplicateUser = 'Registration failed';
        }
      });
    });
  }
}
