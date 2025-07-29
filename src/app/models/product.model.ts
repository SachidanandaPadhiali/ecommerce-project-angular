export interface Product {
    sellerId: string;
    id?: string;
    name: string;
    price: number;
    category: string;
    description: string;
    quantity: number;
    isOnSale?: boolean;
    rating?: number;
    imageUrl?: string;
}
