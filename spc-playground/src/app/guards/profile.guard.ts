import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const profileGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
 
  return userService
    .getSession()
    .pipe(
      map(({ data, error }) => data.session?.user.id === route.params['userId'] ? true : router.createUrlTree(['']))
    );
};
