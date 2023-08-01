import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PartsService } from '../parts.service';
import { UserService } from '../../user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css'],
})
export class DrawingComponent implements OnDestroy {
  isLoading: boolean = false;
  errorMessage: string = '';
  subscription!: Subscription;

  constructor(
    private partsService: PartsService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  async addDrawingHandler(form: NgForm): Promise<any> {
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
    const user = await this.userService.getSession();
    const creator_id = user?.user.id;
    const drawingNameArr = drawing.name.split('.');
    const fileExtension = drawingNameArr[drawingNameArr.length - 1];

    this.isLoading = true;

    if (fileExtension !== 'pdf' || fileExtension !== 'tiff') {
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


    try {
      const uploadResult = await this.partsService.uploadDrawingFile(
        drawing.name,
        drawing
      );
      file_url = uploadResult.path;
    } catch (error) {
      if (error) {
        this.errorMessage = 'Something went wrong!';
        throw error;
      }
    }

    this.subscription = this.partsService
      .createDrawing({
        drawing_name,
        drawing_number,
        drawing_revision,
        revision_date,
        creator_id,
        file_url,
      })
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            throw error;
          }
        },
      });

    this.errorMessage = '';
    this.isLoading = false;
    this.snackBar.open('Success', 'Close', {
      duration: 5000,
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
