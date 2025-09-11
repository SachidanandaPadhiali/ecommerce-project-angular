import { CartEntry } from "./CartEntry.model";
import { EcommUser } from "./EcommUser.model";
import { UserAddress } from "./UserAddress.model";

export interface OrderModel {
    id: number;
    items: CartEntry[];
    shippingAddress: UserAddress;
    orderDate: any;
    createdAt: any;
    userOrder: any;
    total: number|0;
    status:string;
}