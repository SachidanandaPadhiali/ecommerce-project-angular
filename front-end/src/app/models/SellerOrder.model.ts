import { CartEntry } from "./CartEntry.model";
import { UserAddress } from "./UserAddress.model";

export interface SellerOrderModel {
    id: number;
    orderId: number;
    shippingAddress: UserAddress;
    items: CartEntry[];
}