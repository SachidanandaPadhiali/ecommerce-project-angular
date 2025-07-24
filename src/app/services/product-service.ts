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
    console.warn("Product Service is called");
    return this.http.post('http://localhost:3000/products', data);
  }

  viewProductBySeller(sellerId: String): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/products?sellerId=${sellerId}`);
  }

  removeProduct(id: string) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProductById(id: string) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: Product) {
    return this.http.put(`http://localhost:3000/products/${product.id}`, product);
  }
}
