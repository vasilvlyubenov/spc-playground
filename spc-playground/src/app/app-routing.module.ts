import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':partId',
    loadChildren: () => import('./features/batch/batch.module').then((m) => m.BatchModule),
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
