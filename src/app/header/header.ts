import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
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
