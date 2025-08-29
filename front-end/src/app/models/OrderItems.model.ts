import { Product } from "./product.model";

export interface OrderItems {
  userId: number;
  product: Product;
  productId: number;
  quantity?: number;
  price: number;
}