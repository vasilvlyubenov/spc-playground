import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BatchService } from '../batch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PartsService } from '../../parts/parts.service';
import { ISpc } from 'src/app/interfaces/Spc';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-measurements',
  templateUrl: './add-measurements.component.html',
  styleUrls: ['./add-measurements.component.css'],
})
export class AddMeasurementsComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  errorMessage: string = '';
  getBatchSub!: Subscription;
  insertSpcSub!: Subscription;
  getPartSub!: Subscription;
  batchId: string = '';
  batchSpc!: string;
  partSpcDimensions!: Array<ISpc>;

  constructor(
    private batchService: BatchService,
    private route: ActivatedRoute,
    private router: Router,
    private partService: PartsService,
    private snackBar: MatSnackBar
  ) {}

  addDimResultsSubmitHandler(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const {
      dimensionId,
      firstMeasurement,
      secondMeasurement,
      thirdMeasurement,
      fourthMeasurement,
      fifthMeasurement,
      measurementDate,
    } = form.form.value;

    let dimensionArr: Array<any> = this.batchSpc
      ? JSON.parse(this.batchSpc)
      : [];

    const results = {
      firstMeasurement,
      secondMeasurement,
      thirdMeasurement,
      fourthMeasurement,
      fifthMeasurement,
    };

    const inArray = dimensionArr.find((x) => x.dimensionId === dimensionId);
    interface IObj {
      dimensionId: string;
      results: Array<Object>;
      measurementDate: Date;
    }

    if (!inArray) {
      const obj: IObj = {
        dimensionId,
        results: [results],
        measurementDate,
      };

      dimensionArr.push(obj);
    } else {
      dimensionArr.map((x) => {
        if (x.dimensionId === dimensionId) {
          x.results.push(results);
        }
      });
    }

    this.batchSpc = JSON.stringify(dimensionArr);

    this.isLoading = true;
    this.insertSpcSub = this.batchService
      .insertSpcDimensions(this.batchId, this.batchSpc)
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            this.isLoading = false;
            throw error;
          }
          this.errorMessage = '';
          this.isLoading = false;
          form.reset();
          this.snackBar.open('Success', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  ngOnInit(): void {
    this.batchId = this.route.snapshot.params['batchId'];
    const partId = this.route.snapshot.params['partId'];
    this.isLoading = true;

    this.getBatchSub = this.batchService.getBatchById(this.batchId).subscribe({
      next: ({ data, error }) => {
        if (error) {
          alert('Something went wrong please try again later');
          this.router.navigate([`${partId}/batch-list`]);
          throw error;
        }

        if (data.length === 0) {
          alert('Something went wrong please try again later');
          this.router.navigate([`${partId}/batch-list`]);
        }

        this.batchSpc = data[0].spc_dimension_results;
      },
    });

    this.getPartSub = this.partService.getPartById(partId).subscribe({
      next: ({ data, error }) => {
        if (error) {
          alert('Something went wrong please try again later');
          this.router.navigate([`${partId}/batch-list`]);
          throw error;
        }

        const spcDimensions = JSON.parse(data[0].spc_dimensions);

        if (spcDimensions.length > 0) {
          this.partSpcDimensions = spcDimensions;
        }
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.insertSpcSub) {
      this.insertSpcSub.unsubscribe();
    }
    this.getPartSub.unsubscribe();
    this.getBatchSub.unsubscribe();
  }
}
