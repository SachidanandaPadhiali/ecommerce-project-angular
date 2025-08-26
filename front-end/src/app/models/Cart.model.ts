import { CartEntry } from "./CartEntry.model";
import { EcommUser } from "./EcommUser.model";

export interface Cart {
    id: number;
    user: EcommUser;
    items: CartEntry[];
    userOrder: any;
    total: number|0;
    totalCartCount: number;
    status:string;
}