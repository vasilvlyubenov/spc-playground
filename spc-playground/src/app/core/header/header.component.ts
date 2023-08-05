import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Subscription, switchMap } from 'rxjs';
import { UserService } from 'src/app/features/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  isMenuCollapsed: boolean = true;
  logoutSubscription: Subscription | undefined;
  avatarSub: Subscription | undefined;
  user!: User | undefined;
  avatarURL!: string;
  sessionSub!: Subscription;
  onInitSub!: Subscription;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

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

  ngOnInit(): void {
    console.log();
    
    let userId;
    this.onInitSub = this.userService.getSession().subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error(error);
          throw error;
        }

        if (data.session) {
          this.user = data.session?.user;
          userId = data.session.user.id;
          console.log(userId);
          
        }
      },
    });
    console.log(this.userService.userData?.data.user?.id);
    
    this.userService
      .getUserInfo(this.userService.userData?.data.user?.id)
      .pipe(
        switchMap(async ({ data, error }) => {

          if (error) {
            console.error(error);
            throw error;
          }

          const avatarUrl = data[0].avatar_path;
          console.log(avatarUrl);

          return this.userService.getUserAvatarURL(avatarUrl);
        })
      )
      .subscribe((url) => (this.avatarURL = url));
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
