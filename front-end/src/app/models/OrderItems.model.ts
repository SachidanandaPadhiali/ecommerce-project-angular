import { Product } from "./product.model";

export interface OrderItems {
  id: number;
  userId: number;
  product: Product;
  productId: number;
  quantity?: number;
  price: number;
  status: string;
}