import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/features/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  isMenuCollapsed: boolean = true;
  logoutSubscription: Subscription | undefined;
  sessionSubscription: Subscription | undefined;
  session!: Object | null;
  refSubscription: Subscription | undefined;

  constructor(private userService: UserService) { }

  get isLogged(): boolean {
    return !!this.userService.isLogged;
  }

  logout(): void {
    this.logoutSubscription = this.userService.signOut().subscribe({
      next: ({ data, error }) => {
        if (error) {
          throw error.message;
        }
      },
      error: (err) => {
        return console.error(err);
      },
    });

    this.isMenuCollapsed = true;
  }

  ngOnInit(): void {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      this.refSubscription = this.userService.refreshSession({ refresh_token: refreshToken }).subscribe({
        next({data, error}) {
            if (error) {
              if (error.name === 'AuthApiError') {
                localStorage.removeItem('refresh_token');
              }
            }
            
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }

    if (this.refSubscription) {
      this.refSubscription.unsubscribe();
    }

    this.sessionSubscription?.unsubscribe();
    this.userService.signOut();
  }
}
