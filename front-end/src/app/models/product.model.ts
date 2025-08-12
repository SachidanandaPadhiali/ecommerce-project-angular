export interface Product {
    sellerId: number;
    id?: number;
    name: string;
    description: string;
    price: number;
    discPrice: number;
    category: string;
    imageUrl?: string;
    quantity: number;
    brand: '';
    color: '';
    isOnSale?: boolean;
    rating?: number;
    cartCount?: number;
}
