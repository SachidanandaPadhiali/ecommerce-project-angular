import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  user = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private apiUrl = environment.apiUrl;

  handleSignIn(): void {
    const loginPayload = {
      email: this.user.email,
      password: this.user.password
    };

    this.http.post<any>(`${this.apiUrl}/login`, loginPayload).subscribe(response => {
      if (response && response.role) {
        const role = response.role.toLowerCase();

        if (role === 'user') {
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/user-home']);
        } else if (role === 'seller') {
          const sellerData = {
            id: response.id,
            name: response.name,
            email: response.email,
            phno: response.phno
          };
          localStorage.setItem('seller', JSON.stringify(sellerData));
          this.router.navigate(['/seller-home']);
        } else {
          this.errorMessage = 'Unknown role';
        }
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }, err => {
      this.errorMessage = 'Login failed';
    });
  }

  goToSignUp(): void {
    const requiredRole = localStorage.getItem('role') || '{}';
    console.log(requiredRole);
    if (!this.authService.isAuthenticated(requiredRole)) {
      if (requiredRole === 'seller') {
        console.log("GOING TO SELLER");
        this.router.navigate(['/seller-auth']);
        return;
      }
      this.router.navigate(['/user-auth']);
    }
  }
}
//Pass@123