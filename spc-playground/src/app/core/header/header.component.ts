import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Subscription} from 'rxjs';
import { UserService } from 'src/app/features/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy {
  isMenuCollapsed: boolean = true;
  logoutSubscription: Subscription | undefined;
  avatarSub: Subscription | undefined;
  user!: User | undefined;
  sessionSub!: Subscription;
  onInitSub!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  get isLogged(): boolean {
    return !!this.userService.isLogged;
  }

  getSession() {
    this.sessionSub = this.userService.getSession().subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error(error);
          throw error;
        }
        if (data) {
          this.user = data.session?.user;
        }
      },
    });
  }

  logout(): void {
    this.logoutSubscription = this.userService.signOut().subscribe({
      next: ({ error }) => {
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
    this.avatarSub?.unsubscribe();
    this.onInitSub.unsubscribe();
    this.sessionSub.unsubscribe();
  }
}
