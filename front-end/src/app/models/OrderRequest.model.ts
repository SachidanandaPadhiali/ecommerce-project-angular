import { EcommUser } from "./EcommUser.model";
import { UserAddress } from "./UserAddress.model";

export interface OrderRequest {
    userId: number;
    addressId: number;
    cartId: number;
    orderTotal: number;
    isExpressDelivery: boolean;
}