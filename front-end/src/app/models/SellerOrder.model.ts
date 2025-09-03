import { CartEntry } from "./CartEntry.model";
import { OrderItems } from "./OrderItems.model";
import { UserAddress } from "./UserAddress.model";

export interface SellerOrderModel {
    id: number;
    orderId: number;
    shippingAddress: UserAddress;
    item: OrderItems;
    status: string;
}