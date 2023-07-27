import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PartsService } from '../parts.service';
import { IDrawing } from 'src/app/interfaces/Drawing';
import { IPart } from 'src/app/interfaces/Part';

interface IDynamicFormField {
  index: number;
  label: string;
  control: FormControl;
}

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
  dynamicForm!: FormGroup;
  dynamicFormFields: IDynamicFormField[] = [];
  dynamicFormFieldsCount: number = 3;
  keys: Array<string> = ['dimension', 'upperLimit', 'lowerLimit'];
  partSubmitted: boolean = false;
  errorMessageForDim: string = '';

  constructor(
    private partsService: PartsService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  createPartSubmitHandler(form: NgForm): void {
    const part: IPart = form.form.value;
    console.log(part);
    this.partSubmitted = true;
  }

  createDynamicFormFields(keys: string[]): void {
    for (let i = 0; i < keys.length; i++) {
      const controlName = `field_${i}`;
      const label = keys[i];
      const control = new FormControl(''); // You can provide an initial value here if needed

      this.dynamicForm.addControl(controlName, control);
      this.dynamicFormFields.push({
        label,
        control,
        index: this.dynamicFormFields.length,
      });
    }
  }

  addDimensionsSubmitHandler() {
    const formDataArray = [];
    const remainingFields = this.dynamicFormFields.slice(0); // Create a copy of dynamicFormFields array

    // Filter out fields that have been removed and construct formDataArray
    while (remainingFields.length > 0) {
      const formDataObject: { [key: string]: string } = {};
      for (let j = 0; j < this.keys.length && remainingFields.length > 0; j++) {
        formDataObject[this.keys[j]] = remainingFields.shift()!.control.value;
      }
      formDataArray.push(formDataObject);
    }

    console.log(
      'Generated JSON Array:',
      JSON.stringify(formDataArray, null, 2)
    );
  }

  addFields() {
    this.createDynamicFormFields(this.keys);
  }

  removeFieldsMultiple() {
    const currentFieldCount = this.dynamicFormFields.length;
    const lastFieldIndexToRemove =
      currentFieldCount - (currentFieldCount % 3 || 3);
    this.removeFields(lastFieldIndexToRemove);
  }

  private removeFields(index: number) {
    if (this.dynamicFormFields.length > index) {
      const fieldsToRemove = this.dynamicFormFields.splice(index, 3);

      fieldsToRemove.forEach((field) => {
        const controlName = `field_${field.index}`;
        this.dynamicForm.removeControl(controlName);
      });

      this.relabelDynamicFormFields();
      this.changeDetector.detectChanges();
    }
  }

  private relabelDynamicFormFields() {
    for (let i = 0; i < this.dynamicFormFields.length; i++) {
      const controlName = `field_${this.dynamicFormFields[i].index}`;
      const label = this.keys[i % 3];
      this.dynamicForm.setControl(
        controlName,
        this.dynamicFormFields[i].control
      );
      this.dynamicFormFields[i].label = label;
    }
  }

  ngOnInit(): void {
    this.dynamicForm = this.formBuilder.group({});
    this.createDynamicFormFields(this.keys);

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
  }

  ngOnDestroy(): void {
    this.drawingSubscription.unsubscribe();
  }
}
