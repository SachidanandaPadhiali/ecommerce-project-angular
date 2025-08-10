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

  constructor(private newSeller: Seller, private router: Router) { }
  ngOnInit(): void { }

  seller = {
    name: '',
    email: '',
    phoneNo: '',
    gender: 'male',
    role: 'seller',
    password: '',
    confirmPassword: ''
  };

  duplicateSeller: string | null = null;
  
  showError(nameRef: any, emailRef: any, phNoRef: any): boolean {
    return (
      (nameRef.invalid && nameRef.touched) ||
      (emailRef.invalid && emailRef.touched) ||
      (phNoRef.invalid && phNoRef.touched)
    );
  }

  getErrorMessage(nameRef: any, emailRef: any, phNoRef: any): string {
    if (nameRef.errors?.['required'] && nameRef.touched) {
      return 'Name is required.';
    }
    if (emailRef.errors?.['required'] && emailRef.touched) {
      return 'Email is required.';
    }
    if (emailRef.errors?.['email'] && emailRef.touched) {
      return 'Enter a valid email address.';
    }
    if (phNoRef.errors?.['required'] && phNoRef.touched) {
      return 'Phone Number is required.';
    }
    return '';
  }

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

    this.newSeller.sellerSignUp(data).subscribe(
      (response: { responseCode: string; responseMessage: string }) => {
        // Now TypeScript knows response has responseCode and responseMessage
        if (response.responseCode === '001') {
          this.duplicateSeller = 'Email already registered... Please LogIn Instead';
        } else {
          this.duplicateSeller = null;
          this.router.navigate(['/log-in']);
        }
      },
      (err) => {
        console.error('Sign-up failed:', err);
        this.duplicateSeller = 'Registration failed';
      }
    );
  }
}
