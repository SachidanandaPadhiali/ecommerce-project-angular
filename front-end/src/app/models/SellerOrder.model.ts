import { CartEntry } from "./CartEntry.model";
import { OrderItems } from "./OrderItems.model";
import { OrderModel } from "./OrderModel.model";
import { UserAddress } from "./UserAddress.model";

export interface SellerOrderModel {
    id: number;
    order: OrderModel;
    shippingAddress: UserAddress;
    item: OrderItems;
    oldStatus: string;
    status: string;
}