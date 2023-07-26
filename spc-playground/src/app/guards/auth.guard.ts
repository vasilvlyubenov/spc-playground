import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const userSession = await userService.getSession();
  const path = route.url[0].path;
  
  if (path === 'parts') {
    return true;
  } else if (path === 'login' && userSession !== null) {
    router.navigate(['/']);
    return false;
  } else if (path === 'login' && userSession === null) {
    return true;
  } else if (path === 'register' && userSession !== null) {
    router.navigate(['/']);
    return false;
  } else if (path === 'register' && userSession === null) {
    return true;
  } else if (path === 'profile' && userSession !== null) {
    return true;
  } else if (path === 'profile' && userSession === null) {
    router.navigate(['/login']);
    return true;
  } else if (path === 'change-password' && userSession !== null) {
    return true;
  } else if (path === 'change-password' && userSession === null) {
    router.navigate(['/login']);
    return false;
  } else if (path === 'add-drawing' && userSession !== null) {
    return true;
  } else if (path === 'add-drawing' && userSession === null) {
    router.navigate(['/login']);
    return false;
  } else if (path === 'create-part' && userSession !== null) {
    return true;
  } else if (path === 'create-part' && userSession === null) {
    router.navigate(['/login']);
    return false;
  } else {
    return false;
  }
};
