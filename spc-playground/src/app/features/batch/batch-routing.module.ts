import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { BatchComponent } from './create-batch/batch.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { CloseBatchComponent } from './close-batch/close-batch.component';

const routes: Routes = [
  {
    path: ':id/batch-list',
    component: BatchListComponent,
  },
  {
    path: ':id/create-batch',
    component: BatchComponent,
    canActivate: [authGuard]
  },
  {
    path: ':id/batch-list/:id/close_batch',
    component: CloseBatchComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchRoutingModule {}
