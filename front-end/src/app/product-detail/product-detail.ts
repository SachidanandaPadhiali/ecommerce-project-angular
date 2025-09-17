import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { UserService } from '../services/user-service';
import { ProductCard } from '../product-card/product-card';
import { Cart } from '../models/Cart.model';
import { forkJoin, Observable } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as fasHeart, faCartShopping, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // regular (outline)

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, ProductCard, RouterModule, FontAwesomeModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  prodWish = farHeart;
  prodWished = fasHeart;
  cart = faCartShopping;
  delete = faTrash;

  loading: boolean = true;
  error = '';
  product$!: Observable<Product>;

  userId: number = 0;
  prodId: number = 0;
  isWished: boolean = true;
  isInCart: Product = {} as Product;
  cartCount: number = 2;

  maxStars = [1, 2, 3, 4, 5];


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.prodId = parseInt(params.get('productId') || "");
        return this.productService.getProductById(this.prodId ? +this.prodId : 0);
      })
    );

    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    this.userService.isProductWished(this.userId, this.prodId).subscribe({
      next: (exists) => {
        this.isWished = exists;
        console.warn(exists);
      },
      error: (err) => console.error('Error:', err)
    });

    this.userService.isInCart(this.userId, this.prodId).subscribe({
      next: (product) => {
        console.info(product);
        this.isInCart = product;
      },
      error: (err) => console.error('Error:', err)
    });
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('Is product in cart', this.isInCart);
      console.log('Is product wished', this.isWished);
    }, 1000);
  }
  getFill(n: number, rating: number | undefined): string {
    const safeRating = rating ?? 0;  // fallback to 0 if undefined
    // your logic here
    return (Math.min(safeRating - n + 1, 1) * 100) + '%';
  }
  toggleWish() {
    console.log("toggling wish");

    this.isWished = !this.isWished;
    this.cdr.detectChanges();

    if (this.isWished) {
      this.userService.wishProduct(this.userId, this.prodId).subscribe({
        next: () => console.log('Added to wishlist'),
        error: (err) => console.error('Error adding:', err)
      });
    }
    else {
      this.userService.removeFromWishList(this.userId, this.prodId).subscribe({
        next: () => console.log('Removed from wishlist'),
        error: (err) => console.error('Error removing:', err)
      });
    }
  }
}
