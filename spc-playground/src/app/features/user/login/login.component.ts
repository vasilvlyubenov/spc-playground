import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  errorMessage: string = '';
  logSubscription!: Subscription;
  sessionSub!: Subscription;

  constructor(private userService: UserService, private router: Router) { }

  submitLoginHandler(form: NgForm): string | void {
    if (form.invalid) {
      return this.errorMessage = 'Please try again!'
    }

    const { email, password } = form.form.value;

    this.logSubscription = this.userService.signIn(email, password).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.errorMessage = error.message;
          throw error;
        }
        form.reset();
        this.userService.setToken(data.session.refresh_token)
        
        this.errorMessage = '';
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }
}
