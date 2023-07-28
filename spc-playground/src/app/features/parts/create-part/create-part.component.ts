import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgForm,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PartsService } from '../parts.service';
import { IDrawing } from 'src/app/interfaces/Drawing';
import { IPart } from 'src/app/interfaces/Part';
import { IDynamicFormFields } from 'src/app/interfaces/DynamicFormFields';

@Component({
  selector: 'app-create-part',
  templateUrl: './create-part.component.html',
  styleUrls: ['./create-part.component.css'],
})
export class CreatePartComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  errorMessage: string = '';
  drawingSubscription!: Subscription;
  drawings!: Array<IDrawing>;
  partSubmitted: boolean = false;
  errorMessageForDim: string = '';
  partObject!: IPart;

  // My implementation
  dynamicFormGroup!: FormGroup;
  dynamicFormArray!: FormArray;

  constructor(
    private partsService: PartsService,
    private formBuilder: FormBuilder,
  ) {}

  //Handling the Part form and showing the dimension form
  createPartSubmitHandler(form: NgForm): string | void {
    if (form.invalid) {
      return;
    }
    this.partObject = form.form.value;
    this.partSubmitted = true;
  }

  //Handling the Dimensions form and inserting the data to db
  addDimensionsSubmitHandler() {
    //TODO
  }

  get dimensions() {
    return this.dynamicFormGroup.get('dimensions') as FormArray
  }

  basicForm(): FormGroup {
    return this.formBuilder.group({
      dimension: ['', [
        Validators.required,
        Validators.pattern('^\\d*\\.?\\d+$'),
      ]],
      upperLimit: ['', [
        Validators.required,
        Validators.pattern('^\\d*\\.?\\d+$'),
      ]],
      lowerLimit: ['', [
        Validators.required,
        Validators.pattern('^\\d*\\.?\\d+$'),
      ]],
    });
  }


  addNewForm(): void {
    this.dimensions.push(this.basicForm());
  }

  removeForm(i: number): void {
    this.dimensions.removeAt(i);
  }

  ngOnInit(): void {
    this.drawingSubscription = this.partsService.getAllDrawings().subscribe({
      next: ({ data, error }) => {
        this.isLoading = true;
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }
        this.drawings = data;
      },
      complete: () => {
        this.isLoading = false;
      },
    });

    this.dynamicFormGroup = this.formBuilder.group({
      dimensions: this.formBuilder.array([])
    });
  }

  ngOnDestroy(): void {
    this.drawingSubscription.unsubscribe();
  }

}
