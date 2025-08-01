import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  successMessage: string | undefined;
  errorMessage: string | undefined;

  constructor(private http: HttpClient) { }

  addProduct(data: Product) {
    return this.http.post('http://localhost:3000/products', data);
  }

  viewProductBySeller(sellerId: String): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/products?sellerId=${sellerId}`);
  }

  removeProduct(id: string) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/products?category=${category}`);
  }

  getProductById(id: string) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }

  getProductsById(prodIds: string[]): Observable<Product[]> {
    const queryParams = prodIds.map(id => `id=${id}`).join('&');
    console.log("queryParams",queryParams);
    return this.http.get<Product[]>(`http://localhost:3000/products?${queryParams}`);
  }

  updateProduct(product: Product) {
    return this.http.put(`http://localhost:3000/products/${product.id}`, product);
  }
}
