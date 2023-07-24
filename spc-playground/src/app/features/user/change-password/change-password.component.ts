import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  async submitChangePasswordHandler(form: NgForm): Promise<string | void> {
    if (form.invalid) {
      return (this.errorMessage = 'Please try again!');
    }

    const { newPassword, repNewPassword } = form.form.value;

    if (newPassword !== repNewPassword) {
      return (this.errorMessage = "Password doesn't match!");
    }
    this.isLoading = true;
    const error = await this.userService.updatePassword(newPassword);
      
    if (error) {
      this.isLoading = false;
      this.errorMessage = 'New password should be different from the old password.'
      throw error;
    }

    this.errorMessage = '';
    this.router.navigate(['/']);
    this.isLoading = false;
  }
}
