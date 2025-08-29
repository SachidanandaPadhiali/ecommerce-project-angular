import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'];

  if (!authService.isAuthenticated(requiredRole)) {
    if(requiredRole === 'seller'){
          return router.createUrlTree(['/seller-auth']);      
    }
    return router.createUrlTree(['/log-in']);
  }
  return true;
};

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated('user')) {
    return router.createUrlTree(['/user-home']); // Redirect to home if already logged in
  }

  return true; // Allow access if not authenticated
};