import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth-service';

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

  handleSignIn(): void {
    const { email, password } = this.user;

    this.http.get<any[]>(`http://localhost:3000/users?email=${email}&password=${password}`).subscribe(userRes => {
      if (userRes.length > 0) {
        localStorage.setItem('user', JSON.stringify(userRes[0]));
        this.router.navigate(['/user-home']);
      } else {
        this.http.get<any[]>(`http://localhost:3000/seller?email=${email}&password=${password}`).subscribe(sellerRes => {
          if (sellerRes.length > 0) {
            const seller = sellerRes[0];
            const sellerData = {
              id: seller.id,
              name: seller.name,
              email: seller.email,
              phno: seller.phno
            };
            localStorage.setItem('seller', JSON.stringify(sellerData));
            this.router.navigate(['/seller-home']);
          } else {
            this.errorMessage = 'Invalid email or password';
          }
        });
      }
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