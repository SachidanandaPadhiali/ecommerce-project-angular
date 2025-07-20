import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller-auth/seller-auth';
import { SellerHome } from './seller-home/seller-home';
import { Login } from './login/login';
import { UserHome } from './user-home/user-home';
import { authGuard } from './auth-guard';
import { SellerAddProduct } from './seller-add-product/seller-add-product';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'seller-auth', component: SellerAuth},
    { path: 'log-in', component: Login },
    { path: 'user-home', component: UserHome, canActivate: [authGuard], data: { role: 'user' } },
    { path: 'seller-home', component: SellerHome, canActivate: [authGuard], data: { role: 'seller' } },
    {path:'seller-product', component: SellerAddProduct}
];
