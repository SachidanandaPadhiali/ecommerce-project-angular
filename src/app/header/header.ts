import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  userIcon = faUserCircle;
  profileIcon = faUser;
  logoutIcon = faRightFromBracket;
  sellerName :string = "";

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
    const seller = JSON.parse(localStorage.getItem('seller') || '{}');
    this.sellerName = seller?.name;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((val: any) => {
      if (val.url) {
        if (val.url.includes('log') || val.url.includes('auth')) {
          this.menuType = 'auth';
        } else if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.menuType = 'seller';
        } else {
          this.menuType = 'default';
        }
      }

    });
  }

  logOut() {
    this.authService.logout();
  }
}
