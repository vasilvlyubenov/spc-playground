import { Component, OnInit, OnDestroy } from '@angular/core';
import { BatchService } from '../batch.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductionBatch } from 'src/app/interfaces/ProductionBatch';


@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.css'],
})
export class BatchListComponent implements OnInit, OnDestroy {
  batchData!: IProductionBatch[];
  errorMessage: string = '';
  isLoading: boolean = false;
  partId: string = '';
  displayedColumns: string[] = ['Batch number', 'Date approved', 'Date closed', 'SPC measuremetns', 'SPC charts', 'Info' , 'button'];
  filteredBatchSub!: Subscription;


  constructor(
    private batchService: BatchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['partId'];
    this.isLoading = true;

    this.filteredBatchSub = this.batchService
      .getAllPartBatches(this.partId)
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            this.isLoading = false;
            throw error;
          }

          this.batchData = data;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.filteredBatchSub.unsubscribe();
  }
}
