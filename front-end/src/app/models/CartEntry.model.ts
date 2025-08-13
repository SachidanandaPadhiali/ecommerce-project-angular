import { Product } from "./product.model";

export interface CartEntry {
  userId: number;
  product: Product;
  productId: number;
  quantity?: number;
  price: number;
}