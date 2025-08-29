import { CartEntry } from "./CartEntry.model";
import { EcommUser } from "./EcommUser.model";

export interface OrderModel {
    id: number;
    user: EcommUser;
    items: CartEntry[];
    userOrder: any;
    total: number|0;
    status:string;
}