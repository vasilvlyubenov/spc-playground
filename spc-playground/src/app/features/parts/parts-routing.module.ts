import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingComponent } from './drawing/drawing.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { CreatePartComponent } from './create-part/create-part.component';
import { PartComponent } from './part/part.component';
import { BatchComponent } from '../batch/create-batch/batch.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PartComponent,
  },
  {
    path: 'add-drawing',
    component: DrawingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create-part',
    component: CreatePartComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id/create-batch',
    component: BatchComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartsRoutingModule {}
