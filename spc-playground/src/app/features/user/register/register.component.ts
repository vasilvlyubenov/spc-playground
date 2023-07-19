import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedFileName: string = '';

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFileName = file.name;
  }

  clearFileSelection() {
    this.selectedFileName = '';
  }
}
