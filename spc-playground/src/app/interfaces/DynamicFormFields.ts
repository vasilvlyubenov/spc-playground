import { FormControl } from '@angular/forms';

export interface IDynamicFormFields {
  index: number;
  label: string;
  name: string;
  control: FormControl;
}
