import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as fasHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // regular (outline)
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {
  products: Product[] = [];
  category: string = '';
  loading: boolean = true;
  wished: boolean = false;
  prodWish = farHeart;
  prodWished = fasHeart;
  wishList: Set<string> = new Set();
  cart = faCartShopping;
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.loading = true;
        this.category = params.get('name') || '';

        return this.productService.getProductsByCategory(this.category);
      })
    ).subscribe({
      next: (data: Product[]) => {

        this.products = data;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ Force view update
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges(); // ✅ Even on error
      }
    });

    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    this.userService.getWishList(this.userId).subscribe(data => {
      const entry = data[0]; // Assuming only one entry per user
      console.log(entry);
      this.wishList = new Set(entry?.productIds || []);
    });
  }

  maxStars = [1, 2, 3, 4, 5];
  error = '';

  truncateName(name: string): string {
    return name.length > 25 ? name.substring(0, 22) + '...' : name;
  }

  getFill(n: number, rating: number | undefined): string {
    const safeRating = rating ?? 0;  // fallback to 0 if undefined
    // your logic here
    return (Math.min(safeRating - n + 1, 1) * 100) + '%';
  }

  viewProduct(productId: string | undefined): void {
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }
    this.router.navigate(['/product', productId]);
  }

  toggleWish(prodId: string) {
    if (!prodId) return;

    this.wished = !this.wished;
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    if (this.wishList.has(prodId)) {
      this.wishList.delete(prodId);
      this.userService.updateWishList(this.userId, Array.from(this.wishList)).subscribe();
    } else {
      this.wishList.add(prodId);
      this.userService.updateWishList(this.userId, Array.from(this.wishList)).subscribe();
    }
  }

}
