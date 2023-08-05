import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PartsService } from '../parts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css'],
})
export class DrawingComponent implements OnDestroy {
  isLoading: boolean = false;
  errorMessage: string = '';
  subscription!: Subscription;
  result$!: Observable<any>;
  resSub!: Subscription;

  constructor(
    private partsService: PartsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

 addDrawingHandler(form: NgForm): string | void {
    let file_url = '';

    if (form.invalid) {
      return;
    }

    const {
      drawing,
      drawing_name,
      drawing_number,
      drawing_revision,
      revision_date,
    } = form.form.value;
    const creator_id = this.route.snapshot.params['userId'];
    const drawingNameArr = drawing.name.split('.');
    const fileExtension = drawingNameArr[drawingNameArr.length - 1];

    this.isLoading = true;

    if (fileExtension !== 'pdf' && fileExtension !== 'tiff') {
      this.isLoading = false;
      return (this.errorMessage = 'File extension not supported!');
    }

    if (!drawing) {
      this.isLoading = false;
      return (this.errorMessage = "Please upload file: '.pdf, .tiff'");
    }

    if (drawing.size > 10000000) {
      this.isLoading = false;
      return (this.errorMessage = 'File is too big!');
    }

    this.subscription = this.partsService.uploadDrawingFile(drawing.name, drawing).pipe(
      switchMap(async ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }

        file_url = data.path;

        return this.partsService.createDrawing({
          drawing_name,
          drawing_number,
          drawing_revision,
          revision_date,
          creator_id,
          file_url,
        })
      })
    ).subscribe(res => this.result$ = res);

    this.resSub = this.result$.subscribe(({error}) => {
      if (error) {
      this.errorMessage = error.message;
      console.error(error);
      throw error;
      
      }
    })

    this.errorMessage = '';
    this.isLoading = false;
    this.snackBar.open('Success', 'Close', {
      duration: 5000,
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.resSub.unsubscribe();
    }
  }
}
