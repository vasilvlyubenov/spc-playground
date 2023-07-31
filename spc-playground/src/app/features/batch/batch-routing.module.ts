import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { BatchComponent } from './create-batch/batch.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { CloseBatchComponent } from './close-batch/close-batch.component';
import { AddMeasurementsComponent } from './add-measurements/add-measurements.component';
import { SpcChartsComponent } from './spc-charts/spc-charts.component';

const routes: Routes = [
  {
    path: 'batch-list',
    component: BatchListComponent,
  },
  {
    path: 'create-batch',
    component: BatchComponent,
    canActivate: [authGuard]
  },
  {
    path: 'batch-list/:batchId/close-batch',
    component: CloseBatchComponent,
    canActivate: [authGuard]
  },
  {
    path: 'batch-list/:batchId/add-measurements',
    component: AddMeasurementsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'batch-list/:batchId/spc-charts',
    component: SpcChartsComponent,
  },
  {
    path: 'batch-list/:batchId/info',
    component: BatchListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchRoutingModule {}
