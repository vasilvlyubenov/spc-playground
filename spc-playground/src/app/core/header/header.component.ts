import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/features/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy {
  isMenuCollapsed: boolean = true;
  logoutSubscription: Subscription | undefined;
  sessionSubscription: Subscription | undefined;
  session!: Object | null;

  constructor(private userService: UserService, private router: Router) { }

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
    this.router.navigate(['/']);
  }


  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }

    this.sessionSubscription?.unsubscribe();
    this.userService.signOut();
  }
}
