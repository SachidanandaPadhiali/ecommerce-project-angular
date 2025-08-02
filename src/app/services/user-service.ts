import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WishListEntry } from '../models/WishListEntry.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  private wishList: WishListEntry[] = [];

  userSignUp(data: any) {
    return this.http.post(`${this.apiUrl}/users`, data)
  }

  checkDuplicateEmail(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`);
  }

  wishProduct(userId: string, productId: string): void {
    const entry = this.wishList.find(w => w.userId === userId);
    console.log("wishlist called");
    if (entry) {
      if (!entry.productIds.includes(productId)) {
    console.log("wishlist called again");
        entry.productIds.push(productId); // Update
      }
    } else {
      this.wishList.push({ userId, productIds: [productId] }); // Create new
    }
  }

  updateWishList(userId: string, newList: string[]) {
    const body = { userId, productIds: newList };
    return this.http.put(`${this.apiUrl}/wishList/${userId}`, body);
  }

  removeFromWishList(userId: string, productId: string): void {
    const entry = this.wishList.find(w => w.userId === userId);
    if (entry) {
      entry.productIds = entry.productIds.filter(id => id !== productId);
    }
  }

  getWishList(userId: string): Observable<WishListEntry[]> {
    return this.http.get<WishListEntry[]>(`${this.apiUrl}/wishList?userId=${userId}`);
  }
}
