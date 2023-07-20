import { Component} from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  submitLoginHandler(form: NgForm): string | void {
    if (form.invalid) {
      return this.errorMessage = 'Please try again!'
    }

    const { email, password } = form.form.value;

    this.userService.signIn(email, password).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }

        form.reset();
        this.userService.session;
        this.errorMessage = '';
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
