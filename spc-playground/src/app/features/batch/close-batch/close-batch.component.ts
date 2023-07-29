import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from '@supabase/supabase-js';
import { BatchService } from '../batch.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-close-batch',
  templateUrl: './close-batch.component.html',
  styleUrls: ['./close-batch.component.css']
})
export class CloseBatchComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  errorMessage: string = '';
  closeDateSubscription!: Subscription;
  batchId: string = '';
  partId: string = ''

  constructor(private batchService: BatchService, private router: Router, private route: ActivatedRoute) {}

  closeBatchSubmitHandler(form: NgForm) {
      if (form.invalid) {
        return;
      }

      const { closed_by, closed_date } = form.form.value;

      this.batchService.closeBatch(this.batchId, closed_by, closed_date ).subscribe({
        next: ({data, error}) => {
          if (error) {
            this.errorMessage = error.message;
            throw error;
          }

          this.isLoading = true;
          this.router.navigate([`${this.partId}/batch-list`]);
        }
      });
  }

  ngOnInit(): void {
      this.batchId = this.route.snapshot.params['id'];   
      this.partId = this.route.snapshot.url['0'].path;
         
  }

  ngOnDestroy(): void {
    if (this.closeDateSubscription) {
      this.closeDateSubscription.unsubscribe();
    }
  }
}
