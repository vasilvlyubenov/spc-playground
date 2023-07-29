import { Component, OnInit, OnDestroy } from '@angular/core';
import { BatchService } from '../batch.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductionBatch } from 'src/app/interfaces/ProductionBatch';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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
  displayedColumns: string[] = ['Batch number', 'Date approved', 'Approved by', 'Date closed', 'SPC measuremetns', 'SPC charts', 'Info' , 'button'];
  filteredBatchSub!: Subscription;
  dataSource = ELEMENT_DATA;

  constructor(
    private batchService: BatchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['id'];

    this.filteredBatchSub = this.batchService
      .getAllPartBatches(this.partId)
      .subscribe({
        next: ({ data, error }) => {
          this.isLoading = true;
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
