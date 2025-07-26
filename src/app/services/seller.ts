import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Seller {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/seller';

  sellerSignUp(data: any) {
    return this.http.post(`${this.apiUrl}`, data)
  }
  
  checkDuplicateEmail(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }
}
