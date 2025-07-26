import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/users';

  userSignUp(data: any) {
    return this.http.post(`${this.apiUrl}`, data)
  }

  checkDuplicateEmail(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }
}
