import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const userSession = await userService.getSession();

  if (userSession) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
