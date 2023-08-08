import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { guestGuard } from 'src/app/guards/guest.guard';
import { profileGuard } from 'src/app/guards/profile.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
  },
  {
    path: ':userId/profile',
    component: ProfileComponent,
    canActivate: [profileGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
