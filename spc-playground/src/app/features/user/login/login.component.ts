import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  errorMessage: string = '';
  logSubscription!: Subscription;
  sessionSub!: Subscription;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  submitLoginHandler(form: NgForm): string | void {
    if (form.invalid) {
      return (this.errorMessage = 'Please try again!');
    }
    this.isLoading = true;
    
    const { email, password } = form.form.value;

    this.logSubscription = this.userService.signIn(email, password).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.router.navigate(['/login']);
          this.errorMessage = error.message;
          throw error;
        }
        
        form.reset();
        this.userService.getSession();

        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }

    this.isLoading = false;
  }
}
