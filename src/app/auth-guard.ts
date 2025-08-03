import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'];

  console.log('AuthGuard Check', {
    seller: authService.getSeller(),
    user: authService.getUser(),
    requiredRole
  });

  if (!authService.isAuthenticated(requiredRole)) {
    if(requiredRole === 'seller'){
          return router.createUrlTree(['/seller-auth']);      
    }
    return router.createUrlTree(['/log-in']);
  }
  return true;
};
