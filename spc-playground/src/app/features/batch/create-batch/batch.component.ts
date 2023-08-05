import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, mergeMap, switchMap } from 'rxjs';
import { UserService } from '../../user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchService } from '../batch.service';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css'],
})
export class BatchComponent implements OnDestroy, OnInit {
  isLoading: boolean = false;
  errorMessage: string = '';
  createBatchSubscription!: Subscription;
  partId: string = '';
  createBatch$!: Observable<any>;
  subResult!: Subscription;

  constructor(
    private batchService: BatchService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async createBatchSubmitHandler(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    const { batch_number, approved_by, number_of_cavities, approval_date } = form.form.value;
    
    this.createBatchSubscription = this.userService.getSession().pipe(
      switchMap(async ({data, error}) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }

        const creator_id = data.session?.user.id;

        return this.batchService.createBatch({
          batch_number,
          approved_by,
          number_of_cavities,
          approval_date,
          creator_id,
          part_id: this.partId,
        })
      })
    ).subscribe(res =>this.createBatch$ = res);


    this.subResult = this.createBatch$.subscribe({
      next: ({data, error}) => {
        if (error) {
          this.errorMessage = error.message;
          this.isLoading = false;
          throw error;
        }

        this.router.navigate(['/']);
      }
    })

  }

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['partId'];
  }

  ngOnDestroy(): void {
    if (this.createBatchSubscription) {
      this.createBatchSubscription.unsubscribe();
      this.subResult.unsubscribe();
    }
  }
}
