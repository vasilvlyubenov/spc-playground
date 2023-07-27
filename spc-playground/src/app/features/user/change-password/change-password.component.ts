import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnDestroy {
  errorMessage: string = '';
  updatePassSubscription!: Subscription;

  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {}

  submitChangePasswordHandler(form: NgForm): string | void {
    if (form.invalid) {
      return (this.errorMessage = 'Please try again!');
    }

    const { newPassword, repNewPassword } = form.form.value;

    if (newPassword !== repNewPassword) {
      return (this.errorMessage = "Password doesn't match!");
    }
  
    this.updatePassSubscription = this.userService
      .updatePassword(newPassword)
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            return this.errorMessage = error.message;
          }
          this.errorMessage = '';
          form.reset();
          this.snackBar.open('Success', 'Close', {
            duration: 5000,
          });
        },
      });

  }

  ngOnDestroy(): void {
    if (this.updatePassSubscription) {
      this.updatePassSubscription.unsubscribe();
    }
  }
}
