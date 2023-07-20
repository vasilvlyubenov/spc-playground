import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedFileName: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  createRegisterHandler(form: NgForm): string | void {
    if (form?.invalid) {
      return this.errorMessage = 'Please try again!';
    }

    const { email, password, rePassword } = form?.form.value;

    if (password !== rePassword) {
      return this.errorMessage = 'Password doesn\'t match!'
    }

    this.userService.signUp(email, password).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }
        
        form.reset();
        this.userService.session;
        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      }
    })

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFileName = file.name;
  }

  clearFileSelection() {
    this.selectedFileName = '';
  }
}
