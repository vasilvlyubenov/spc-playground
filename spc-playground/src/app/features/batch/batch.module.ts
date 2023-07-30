import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchComponent } from './create-batch/batch.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchRoutingModule } from './batch-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CloseBatchComponent } from './close-batch/close-batch.component';
import { AddMeasurementsComponent } from './add-measurements/add-measurements.component';


@NgModule({
  declarations: [BatchComponent, BatchListComponent, CloseBatchComponent, AddMeasurementsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    SharedModule,
    BatchRoutingModule,
    MatTableModule
  ]
})
export class BatchModule { }
