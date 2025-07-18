import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Seller {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/seller';

  userSignUp(data: any) {
    console.warn("Sign-Up Service Called");
    return this.http.post("http://localhost:3000/seller", data)
  }
  checkDuplicateEmail(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }
}
