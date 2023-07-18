import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './page404/page404.component';
import { SpinnerComponent } from './spinner/spinner.component';




@NgModule({
  declarations: [
    Page404Component,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Page404Component,
    SpinnerComponent
  ]
})
export class SharedModule { }
