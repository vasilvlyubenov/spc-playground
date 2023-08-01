import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';
import { inject } from '@angular/core';


export const profileGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userSession = await userService.getSession();
  console.log(userSession?.user.id);
  console.log(route.params['userId']);
  
  
  if (route.params['userId'] === userSession?.user.id) {
    return true;
  }

  return router.createUrlTree(['/']);
};
