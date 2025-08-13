import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller-auth/seller-auth';
import { SellerHome } from './seller-home/seller-home';
import { Login } from './login/login';
import { UserHome } from './user-home/user-home';
import { authGuard } from './auth-guard';
import { SellerAddProduct } from './seller-add-product/seller-add-product';
import { UserAuth } from './user-auth/user-auth';
import { Shop } from './shop/shop';
import { Wishlist } from './wishlist/wishlist';
import { UserProfile } from './user-profile/user-profile';
import { UserCart } from './user-cart/user-cart';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'seller-auth', component: SellerAuth },
    { path: 'user-auth', component: UserAuth },
    { path: 'log-in', component: Login },
    { path: 'user-home', component: UserHome, canActivate: [authGuard], data: { role: 'user' } },
    { path: 'seller-home', component: SellerHome, canActivate: [authGuard], data: { role: 'seller' } },
    { path: 'seller-product', component: SellerAddProduct },
    { path: 'seller-product/:id', component: SellerAddProduct },
    { path: 'shop', component: Shop },
    { path: 'user/wishlist', component: Wishlist, canActivate: [authGuard], data: { role: 'user' } },
    { path: 'cart', component: UserCart, canActivate: [authGuard], data: { role: 'user' } },
    { path: 'user/profile', component: UserProfile, canActivate: [authGuard], data: { role: 'user' } },
    { path: 'shop/category/:name', component: Shop, runGuardsAndResolvers: 'paramsChange' }
];
