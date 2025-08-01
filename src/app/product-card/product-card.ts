import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as fasHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // regular (outline)
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  prodWish = farHeart;
  prodWished = fasHeart;
  cart = faCartShopping;

  maxStars = [1, 2, 3, 4, 5];

  @Input() product!: Product;
  @Input() wishList!: Set<string>;
  @Output() wishToggled = new EventEmitter<string>();

  get isWished(): boolean {
    return this.wishList.has(String(this.product.id));
  }

  onHeartClick() {
    this.wishToggled.emit(this.product.id);
  }

  truncateName(name: string): string {
    return name.length > 25 ? name.substring(0, 22) + '...' : name;
  }

  getFill(n: number, rating: number | undefined): string {
    const safeRating = rating ?? 0;  // fallback to 0 if undefined
    // your logic here
    return (Math.min(safeRating - n + 1, 1) * 100) + '%';
  }
}
