import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PartsService } from '../../parts/parts.service';
import { UserService } from '../../user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css'],
})
export class BatchComponent implements OnDestroy, OnInit {
  isLoading: boolean = false;
  error: string = '';
  createBatchSubscription!: Subscription;
  partId: string = '';

  constructor(
    private partService: PartsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async createBatchSubmitHandler(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { batch_number, approved_by, number_of_cavities, approval_date } = form.form.value;
    const userSession = await this.userService.getSession();
    const userId = userSession?.user.id;

    this.createBatchSubscription = this.partService
      .createBatch({
        batch_number,
        approved_by,
        number_of_cavities,
        approval_date,
        creator_id: userId,
        part_id: this.partId,
      })
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            if (error.code === '23505') {
              this.error = 'Batch number already exists!';
            } else {
              this.error = error.message;
            }
          }
          this.router.navigate(['/']);
        },
      });
  }

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['id'];
    console.log(this.partId);
  }

  ngOnDestroy(): void {
    if (this.createBatchSubscription) {
      this.createBatchSubscription.unsubscribe();
    }
  }
}
