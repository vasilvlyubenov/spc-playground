import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy{
  selectedFileName: string = '';
  errorMessage: string = '';
  regSubscription!: Subscription;
  sessionSub!: Subscription;

  constructor(private userService: UserService, private router: Router) { }

  createRegisterHandler(form: NgForm): string | void {
    if (form?.invalid) {
      return this.errorMessage = 'Please try again!';
    }

    const { email, password, rePassword } = form?.form.value;

    if (password !== rePassword) {
      return this.errorMessage = 'Password doesn\'t match!'
    }

    this.regSubscription = this.userService.signUp(email, password).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }
        
        form.reset();
        this.userService.setToken(data.session.refresh_token)

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

  ngOnDestroy(): void {

    if (this.regSubscription) {
      this.regSubscription.unsubscribe()
    }
  }
}
