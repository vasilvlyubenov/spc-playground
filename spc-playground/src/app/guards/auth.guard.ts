import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

 return userService.getSession().pipe(
  map(({data, error}) => data.session?.user ? true : router.createUrlTree(['login']))
 );
};
