import { CartEntry } from "./CartEntry.model";
import { EcommUser } from "./EcommUser.model";
import { UserAddress } from "./UserAddress.model";

export interface OrderModel {
    id: number;
    user: EcommUser;
    items: CartEntry[];
    shippingAddress: UserAddress;
    userOrder: any;
    total: number|0;
    status:string;
}