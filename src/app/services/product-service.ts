import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

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
}
