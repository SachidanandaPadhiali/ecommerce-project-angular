import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  private apiUrl = environment.apiUrl;
  private sellerApiUrl = `${this.apiUrl}/api/seller`;
  private productApiUrl = `${this.apiUrl}/api/product`;

  /**
   * Adds a new product to the seller's inventory.
   * @param {Product} data - The product data to be added.
   * @return {Observable<any>} An observable containing the response from the server.
   * */
  addProduct(data: Product) {
    return this.http.post(`${this.sellerApiUrl}/addProduct`, data);
  }

  /**
   * Retrieves all products added by a specific seller.
   * @param {number} sellerId - The unique identifier of the seller.
   * @return {Observable<Product[]>} An observable containing the list of products.
   */
  viewProductBySeller(sellerId: number): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.sellerApiUrl}/getProducts`, { sellerId });
  }
  /**
   * Updates an existing product in the seller's inventory.
   * @param {Product} product - The product data to be updated.
   * @return {Observable<any>} An observable containing the response from the server.
   * */
  updateProduct(product: Product) {
    return this.http.put(`${this.sellerApiUrl}/addProduct/${product.id}`, product);
  }

  /**
   * Removes a product from the seller's inventory.
   * @param {string} id - The unique identifier of the product to be removed.
   * @return {Observable<any>} An observable containing the response from the server.
   * */
  removeProduct(productId: string) {
    return this.http.delete(`${this.sellerApiUrl}/deleteProduct/${productId}`);
  }

  /**
   * Retrieves products by category.
   * @param {string} category - The category to filter products by.
   * @return {Observable<Product[]>} An observable containing the list of products in the specified category.
   * */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productApiUrl}?category=${category}`);
  }

  /**
   * Retrieves a product by its unique identifier.
   * @param {string} id - The unique identifier of the product.
   * @return {Observable<Product>} An observable containing the product data.
   * */
  getProductById(productId: string): Observable<Product> {
    const params = new HttpParams().set('productId', productId);
    return this.http.get<Product>(`${this.productApiUrl}/getProductById`, { params });
  }

  /**
   * Retrieves a list of products by their unique identifiers.
   * @param {string[]} prodIds - An array of product identifiers.
   * @return {Observable<Product[]>} An observable containing the list of products.
   */
  getProductsById(prodIds: string[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.productApiUrl}/productsByIds`, { prodIds });
  }
}
