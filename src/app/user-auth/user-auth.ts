import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-auth',
  imports: [ CommonModule, FormsModule, RouterLink],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css'
})
export class UserAuth  implements OnInit {

  constructor(private newuser: UserService, private router:Router) { }
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

    this.newuser.checkDuplicateEmail(this.user.email).subscribe((res) => {
      if (res.length > 0) {
        // Duplicate found
        this.duplicateUser = 'Email already registered... Please LogIn Instead';
        return;
      }

      // No duplicate, proceed with sign-up
      this.newuser.userSignUp(data).subscribe({
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
