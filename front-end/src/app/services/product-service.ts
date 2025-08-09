import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  successMessage: string | undefined;
  errorMessage: string | undefined;

  constructor(private http: HttpClient) { }

  private apiUrl = `$(environment.apiUrl)/api/seller`;

  addProduct(data: Product) {
    return this.http.post(`${this.apiUrl}/addProduct`, data);
  }

  viewProductBySeller(sellerId: String): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?sellerId=${sellerId}`);
  }

  removeProduct(id: string) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${category}`);
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsById(prodIds: string[]): Observable<Product[]> {
    const queryParams = prodIds.map(id => `id=${id}`).join('&');
    console.log("queryParams",queryParams);
    return this.http.get<Product[]>(`${this.apiUrl}/products?${queryParams}`);
  }

  updateProduct(product: Product) {
    return this.http.put(`${this.apiUrl}/products/${product.id}`, product);
  }
}
