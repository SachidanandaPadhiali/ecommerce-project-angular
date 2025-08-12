import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { CartEntry } from '../models/CartEntry.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  private cart: CartEntry[] = [];

  userSignUp(data: object): Observable<{ responseCode: string; responseMessage: string }> {
    return this.http.post<{ responseCode: string; responseMessage: string }>(`${this.apiUrl}/user`, data)
  }

  wishProduct(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/addProductWishList`, { userId, productId });
  }

  removeFromWishList(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/deleteProductWishList`, { userId, productId });
  }

  getWishList(userId: number): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/getWishList`, { userId });
  }

  addToCart(userId: number, productId: number): Observable<CartEntry> {
    const mockResponse: CartEntry = {
      userId: userId,
      productId: productId,
      quantity: 1
    };

    console.log(`Adding product ID ${productId} to cart for user ID ${userId}`);
    return this.http.post<CartEntry>(`${this.apiUrl}/addToCart`, { productId });
  }

  getUserCart(): Observable<CartEntry[]> {
    return this.http.get<CartEntry[]>(`/user/cart`);
  }

  clearCart(): void {
    this.cart = [];
    console.log('Cart cleared');
  }
}
