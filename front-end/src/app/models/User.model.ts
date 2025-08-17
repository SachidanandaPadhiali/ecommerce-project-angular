import { UserAddress } from "./UserAddress.model";

export interface User{
    id: number;
    userName: string;
    email: string;
    phoneNumber: string;
    userAddresses?: UserAddress[];
}