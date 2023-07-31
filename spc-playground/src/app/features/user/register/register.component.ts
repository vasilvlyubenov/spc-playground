import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnDestroy {
  hidePassword: boolean = true;
  hideRepassword: boolean = true;
  selectedFileName: string = '';
  errorMessage: string = '';
  regSubscription!: Subscription;
  sessionSub!: Subscription;
  avatarSubscription!: Subscription;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  createRegisterHandler(form: NgForm): string | void {
    if (form.invalid) {
      return;
    }

    const { avatar, email, password, rePassword } = form?.form.value;

    if (password !== rePassword) {
      return this.errorMessage = 'Password doesn\'t patch'
    }

    if (avatar) {
      if (avatar.size > 5000000) {
        return (this.errorMessage = 'File size greater than 5 MB!');
      }
    }

    this.isLoading = true;

    this.regSubscription = this.userService.signUp(email, password).subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.router.navigate(['/register']);
          this.errorMessage = error.message;
          this.isLoading = false;
          throw error;
        }
        if (avatar) {
          this.userService.uploadAvatar(avatar.name, avatar);
        }

        form.reset();

        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.regSubscription) {
      this.regSubscription.unsubscribe();
    }

    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
    this.isLoading = false;
  }
}
