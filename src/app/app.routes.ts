import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller-auth/seller-auth';

export const routes: Routes = [
    {
        component: Home,
        path: ''
    },
    {
        component: SellerAuth,
        path: 'seller-auth'
    },
];
