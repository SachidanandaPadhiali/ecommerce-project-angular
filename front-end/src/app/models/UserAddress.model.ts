import { User } from "./User.model";

export interface UserAddress {
    id?: number;
    flatNo?: string;
    userName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    mobileNumber: string;
    isDefault: boolean;
}