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
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-part',
  templateUrl: './create-part.component.html',
  styleUrls: ['./create-part.component.css'],
})
export class CreatePartComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  errorMessage: string = '';
  drawingSubscription!: Subscription;
  partSubscription!: Subscription;
  drawings!: Array<IDrawing>;
  partSubmitted: boolean = false;
  errorMessageForDim: string = '';
  partObject!: IPart;

  dynamicFormGroup!: FormGroup;
  dynamicFormArray!: FormArray;

  constructor(
    private partsService: PartsService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  //Handling the Part form and showing the dimension form
  async createPartSubmitHandler(form: NgForm): Promise<any> {
    if (form.invalid) {
      return;
    }
    const userId = await this.userService.getSession();
    this.partObject = form.form.value;
    this.partObject.creator_id = userId?.user.id;
    this.partSubmitted = true;
    form.reset();
  }

  //Handling the Dimensions form and inserting the data to db
  addDimensionsSubmitHandler(formGroup: FormGroup) {
    if (formGroup.invalid) {
      return;
    }
    const dimensionsJSON =
      formGroup.value.dimensions.length > 0
        ? JSON.stringify(formGroup.value.dimensions)
        : null;

    this.partObject.spc_dimensions = dimensionsJSON;

    this.partsService.createPart(this.partObject).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessageForDim = error.message;
          this.isLoading = false;
          throw error;
        }

        this.errorMessageForDim = '';
        formGroup.reset();
        this.router.navigate(['/']);
      },
    });
  }

  get dimensions() {
    return this.dynamicFormGroup.get('dimensions') as FormArray;
  }

  basicForm(): FormGroup {
    const dimensionId = uuidv4();
    return this.formBuilder.group({
      id: dimensionId,
      dimension: [
        '',
        [Validators.required, Validators.pattern('^\\d*\\.?\\d+$')],
      ],
      upperLimit: [
        '',
        [Validators.required, Validators.pattern('^\\d*\\.?\\d+$')],
      ],
      lowerLimit: [
        '',
        [Validators.required, Validators.pattern('^\\d*\\.?\\d+$')],
      ],
    });
  }

  addNewForm(): void {
    this.dimensions.push(this.basicForm());
  }

  removeForm(i: number): void {
    this.dimensions.removeAt(i);
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.drawingSubscription = this.partsService.getAllDrawings().subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          this.isLoading = false;
          throw error;
        }
        this.drawings = data;
      },
      complete: () => {
        this.isLoading = false;
      },
    });

    this.dynamicFormGroup = this.formBuilder.group({
      dimensions: this.formBuilder.array([]),
    });
  }

  ngOnDestroy(): void {
    this.drawingSubscription.unsubscribe();
  }
}
