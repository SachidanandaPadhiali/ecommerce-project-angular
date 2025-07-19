import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-auth',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './seller-auth.html',
  styleUrl: './seller-auth.css'
})
export class SellerAuth {

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

  signUp() {
    if (this.passwordMismatch) return;

    if (!this.isPasswordValid(this.user.password)) return;

    if (!this.isPasswordLong(this.user.password)) return;

    // Example duplicate check
    if (this.user.email === 'test@example.com') {
      this.duplicateUser = 'Email already registered';
      return;
    }

    console.log('User registered:', this.user);
    this.duplicateUser = null;
    // Redirect or show success
  }
}
