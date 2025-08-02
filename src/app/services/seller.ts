import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Seller {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;

  sellerSignUp(data: any) {
    return this.http.post(`${this.apiUrl}`, data)
  }
  
  checkDuplicateEmail(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }
}
