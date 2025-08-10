import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-auth',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css'
})
export class UserAuth implements OnInit {

  constructor(private newuser: UserService, private router: Router) { }
  ngOnInit(): void { }

  user = {
    name: '',
    email: '',
    gender: '',
    role: 'user',
    phoneNo: '',
    password: '',
    confirmPassword: ''
  };

  duplicateUser: string | null = null;
  showDropdown: boolean = false;

  showError(nameRef: any, emailRef: any, phNoRef: any, genderRef: any): boolean {
    return (
      (nameRef.invalid && nameRef.touched) ||
      (emailRef.invalid && emailRef.touched) ||
      (phNoRef.invalid && phNoRef.touched) ||
      (genderRef.invalid && genderRef.touched)
    );
  }

  getErrorMessage(nameRef: any, emailRef: any, phNoRef: any, genderRef: any): string {
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
    if (genderRef.errors?.['required'] && genderRef.touched) {
      return 'Gender is required.';
    }
    return '';
  }

  // Method to toggle the dropdown visibility
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectGender(gender: string) {
    this.user.gender = gender;
    this.showDropdown = false;
  }
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

    this.newuser.userSignUp(data).subscribe(
      (response: { responseCode: string; responseMessage: string }) => {
        // Now TypeScript knows response has responseCode and responseMessage
        if (response.responseCode === '001') {
          this.duplicateUser = 'Email already registered... Please LogIn Instead';
        } else {
          this.duplicateUser = null;
          this.router.navigate(['/log-in']);
        }
      },
      (err) => {
        console.error('Sign-up failed:', err);
        this.duplicateUser = 'Registration failed';
      }
    );
  }
}
