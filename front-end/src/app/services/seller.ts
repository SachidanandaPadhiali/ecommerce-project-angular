import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SellerOrderModel } from '../models/SellerOrder.model';

@Injectable({
  providedIn: 'root'
})
export class Seller {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;
  private sellerApiUrl = `${this.apiUrl}/seller`;

  sellerSignUp(data: object): Observable<{ responseCode: string; responseMessage: string }> {
    return this.http.post<{ responseCode: string; responseMessage: string }>(`${this.apiUrl}/user`, data)
  }

  getUserOrders(userId: number): Observable<SellerOrderModel[]> {
    return this.http.post<SellerOrderModel[]>(`${this.apiUrl}/getUserOrders`, { userId });
  }

}
