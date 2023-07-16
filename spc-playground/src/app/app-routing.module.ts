import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//   {
//     path: '',
//     pathMatch: 'full',
    
//   },
//   {
//     path: 'register',
//   },
//   {
//     path: 'login'
//   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
