import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Seller {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;

  sellerSignUp(data: object): Observable<{ responseCode: string; responseMessage: string }> {
    return this.http.post<{ responseCode: string; responseMessage: string }>(`${this.apiUrl}/user`, data)
  }

}
