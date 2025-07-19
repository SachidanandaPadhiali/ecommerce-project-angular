import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller-auth/seller-auth';
import { SellerHome } from './seller-home/seller-home';
import { Login } from './login/login';
import { UserHome } from './user-home/user-home';

export const routes: Routes = [
    {
        component: Home,
        path: ''
    },
    {
        component: SellerAuth,
        path: 'seller-auth'
    },
    {
        component: Login,
        path: 'log-in'
    },
    {
        component: SellerHome,
        path: 'seller-home'
    },
    {
        component: UserHome,
        path: 'user/home'
    }
];
