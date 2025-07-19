import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUser() {
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user')!);
    }
    return null;
  }

  getSeller() {
    if (typeof window !== 'undefined' && localStorage.getItem('seller')) {
      return JSON.parse(localStorage.getItem('seller')!);
    }
    return null;
  }

  isAuthenticated(role: string): boolean {
    const user = this.getUser();
    const seller = this.getSeller();

    if (role === 'seller') return seller !== null;
    if (role === 'user') return user !== null;
    return user !== null || seller !== null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}
