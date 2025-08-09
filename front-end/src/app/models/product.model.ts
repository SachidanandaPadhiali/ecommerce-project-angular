export interface Product {
    sellerId: string;
    id?: string;
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
}
