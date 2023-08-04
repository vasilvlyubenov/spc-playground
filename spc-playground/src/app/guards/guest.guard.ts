import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const isLogged = userService.isLogged;

  if (!isLogged) {
    return true;
  }

  return router.createUrlTree(['/']);
};
