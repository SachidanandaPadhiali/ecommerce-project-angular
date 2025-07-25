import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faRightFromBracket, faUserCircle, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  userIcon = faUserCircle;
  heartIcon = faHeart;
  profileIcon = faUser;
  logoutIcon = faRightFromBracket;

  name: string = "";

  isMenuOpen = false;
  searchQuery: string = '';
  authService = inject(AuthService);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
  }
  menuType: String = 'default';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((val: any) => {
      if (val.url) {
        if (val.url.includes('log') || val.url.includes('auth')) {
          this.menuType = 'auth';
        } else if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.menuType = 'seller';
          this.name = JSON.parse(localStorage.getItem('seller') || '{}')?.name;
        } else if (localStorage.getItem('user') && val.url.includes('user')) {
          this.menuType = 'user';
          this.name = JSON.parse(localStorage.getItem('user') || '{}')?.name;
        } else {
          this.menuType = 'default';
        }
      }

    });
  }

  becomeSeller() {
    localStorage.setItem('role', "seller");
    this.router.navigate(['/seller-home']);
  }

  goToSignIn(): void {
    localStorage.setItem('role', "user");
    this.router.navigate(['/log-in']);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
