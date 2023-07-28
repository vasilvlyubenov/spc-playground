import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css'],
})
export class BatchComponent {
  isLoading: boolean = false;

  createBatchSubmitHandler(fomr: NgForm) {

  }
}
