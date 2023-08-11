import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PartsService } from '../parts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css'],
})
export class DrawingComponent implements OnDestroy, OnInit {
  isLoading: boolean = false;
  errorMessage: string = '';
  uploadSub!: Subscription;
  sessionSubscription!: Subscription;
  createDrawingSub!: Subscription;
  userId!: string | undefined;
  fileUrl!: Object;

  constructor(
    private partsService: PartsService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  async addDrawingHandler(form: NgForm): Promise<string | void> {
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

    this.fileUrl = await this.partsService.uploadDrawingFile(drawing.name, drawing)
    
    this.createDrawingSub = this.partsService
      .createDrawing({
        drawing_name,
        drawing_number,
        drawing_revision,
        revision_date,
        creator_id: this.userId,
        file_url: this.fileUrl,
      })
      .subscribe(({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          console.error(error);
          this.isLoading = false;
          throw error;
        }

        form.reset();
        this.errorMessage = '';
        this.isLoading = false;
        this.snackBar.open('Success', 'Close', {
          duration: 5000,
        });
      });
  }

  ngOnInit(): void {
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
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
      this.createDrawingSub.unsubscribe();
    }
  }
}
