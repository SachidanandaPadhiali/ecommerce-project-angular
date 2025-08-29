import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { CartEntry } from '../models/CartEntry.model';
import { Cart } from '../models/Cart.model';
import { UserAddress } from '../models/UserAddress.model';
import { OrderRequest } from '../models/OrderRequest.model';
import { OrderModel } from '../models/OrderModel.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

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

  addToCart(userId: number, productId: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.apiUrl}/addToCart?userId=${userId}&productId=${productId}`,
      {}
    );
  }

  removeFromCart(userId: number, productId: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.apiUrl}/removeFromCart?userId=${userId}&productId=${productId}`,
      {}
    );
  }

  getUserCart(userId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/getCart`, { userId });
  }

  getUserAddresses(userId: number): Observable<UserAddress[]> {
    return this.http.post<UserAddress[]>(`${this.apiUrl}/getUserAddresses`, { userId });
  }

  removeAddress(userId: number, addressId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/removeUserAddress?userId=${userId}&addressId=${addressId}`,
      {}
    );
  }

  saveUserAddress(savedAddress: UserAddress): Observable<any> {
    return this.http.post(`${this.apiUrl}/addUserAddress`, savedAddress);
  }

  updateUserAddress(updatedAddress: UserAddress): Observable<any> {
    console.log("addressId",updatedAddress.id);
    return this.http.put(`${this.apiUrl}/addUserAddress?addressId=${updatedAddress.id}`, updatedAddress);
  }

  generateOrder(orderRequest: OrderRequest): Observable<any> {
    console.log(orderRequest);
    return this.http.post(`${this.apiUrl}/generateOrder`, orderRequest);
  }

  getOrderData(orderId: number): Observable<OrderModel> {
    return this.http.post<OrderModel>(`${this.apiUrl}/getOrderData`, { orderId });
  }

}
