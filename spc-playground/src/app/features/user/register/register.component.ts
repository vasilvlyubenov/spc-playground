import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnDestroy, OnInit {
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

    const {email, password, rePassword } = form?.form.value;

    if (password !== rePassword) {
      return this.errorMessage = 'Password doesn\'t patch'
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
        form.reset();

        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
      this.userService.userData;
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
