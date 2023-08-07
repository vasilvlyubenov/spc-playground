import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  sessionSubscription!: Subscription;
  partId: string = '';
  userId: string | undefined;
  createBatchSub!: Subscription;

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
    const { batch_number, approved_by, number_of_cavities, approval_date } =
      form.form.value;

    this.createBatchSub = this.batchService
      .createBatch({
        batch_number,
        approved_by,
        number_of_cavities,
        approval_date,
        creator_id: this.userId,
        part_id: this.partId,
      })
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            this.isLoading = false;
            throw error;
          }

          this.router.navigate(['/']);
        },
      });
  }

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['partId'];

    this.sessionSubscription = this.userService.getSession().subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }
        this.userId = data.session?.user.id;
      },
    });
  }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe();

    if (this.createBatchSub) {
      this.createBatchSub.unsubscribe();
    }
  }
}
