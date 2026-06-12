import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';
import { Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {


    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn()
        ? true
        : router.createUrlTree(['/auth/login']);

};
