import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WishListEntry } from '../models/WishListEntry.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  private wishList: WishListEntry[] = [];

  userSignUp(data: object): Observable<{ responseCode: string; responseMessage: string }> {
    return this.http.post<{ responseCode: string; responseMessage: string }>(`${this.apiUrl}/api/user`, data)
  }

  wishProduct(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/api/addProductWishList`, { userId, productId });
  }

  removeFromWishList(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/api/removeProductWishList`, { userId, productId });
  }

  getWishList(userId: number): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/api/getWishList`, { userId });
  }
}
