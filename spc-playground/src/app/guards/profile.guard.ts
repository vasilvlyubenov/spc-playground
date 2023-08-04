import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../features/user/user.service';
import { inject } from '@angular/core';


export const profileGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  let userId: string | undefined;
 
 userService.getSession().subscribe({
    next: ({data, error}) => {
      if (error) {
        console.error(error);
        throw error;
      }
      console.log(userId);
      console.log(route.params['userId']);
      
      
      userId = data.session?.user.id;
    }
  }).unsubscribe()
  
  if (route.params['userId'] === userId) {
    return true;
  }

  return true;
  // return router.createUrlTree(['/']);
};
