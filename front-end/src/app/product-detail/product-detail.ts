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
import { Shop } from '../shop/shop';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, ProductCard, RouterModule, FontAwesomeModule, Shop],
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
  isInCart: boolean = false;
  cartCount: number = 2;

  maxStars = [1, 2, 3, 4, 5];


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private shop: Shop
  ) { }

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
    console.log('Product ID:', params);
        this.prodId = Number(params.get('productId')) || 0;
        return this.productService.getProductById(this.prodId ? +this.prodId : 0);
      })
    );

    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
  }
  getFill(n: number, rating: number | undefined): string {
    const safeRating = rating ?? 0;  // fallback to 0 if undefined
    // your logic here
    return (Math.min(safeRating - n + 1, 1) * 100) + '%';
  }

  toggleWish(){
    this.shop.toggleWish(this.prodId);
    this.cdr.detectChanges();
  }
}
