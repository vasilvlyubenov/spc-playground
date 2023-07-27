import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingComponent } from './drawing/drawing.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { CreatePartComponent } from './create-part/create-part.component';

const routes: Routes = [
    {
        path: 'add-drawing',
        component: DrawingComponent,
        canActivate: [authGuard]
    },
    {
      path: 'create-part',
      component: CreatePartComponent,
      canActivate: [authGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }