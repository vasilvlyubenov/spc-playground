import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const userSession = await userService.getSession();
  const choice = route.url[0].path;

  if (choice === 'parts') {
    return true;
  } else if (choice === 'login' && userSession !== null) {
    router.navigate(['/']);
    return false;
  } else if (choice === 'login' && userSession === null) {
    return true;
  } else if (choice === 'register' && userSession !== null) {
    router.navigate(['/']);
    return false;
  } else if (choice === 'profile' && userSession !== null) {
    return true;
  } else {
    return false;
  }
};
