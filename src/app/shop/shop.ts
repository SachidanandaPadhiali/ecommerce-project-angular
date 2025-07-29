import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {
  products: Product[] = [];
  category: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef // ✅ Add this
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.loading = true;
          this.category = params.get('name') || '';

          return this.productService.getProductsByCategory(this.category);
        })
      )
      .subscribe({
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
    // Navigate or handle as needed
    this.router.navigate(['/product', productId]);
  }

}
