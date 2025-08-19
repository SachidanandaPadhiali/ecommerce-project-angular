import { User } from "./User.model";

export interface UserAddress {
    id?: number;
    userId: number;
    userName: string;
    flatNo?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
    default: boolean;
}