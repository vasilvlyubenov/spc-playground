import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './features/user/user.service';
import { Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'spc-playground';
  sessionSub!: Subscription;
  refreshSub!: Subscription;
  userId: string | undefined;

  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit(): Promise<any> {
    let refreshToken;
    this.sessionSub = this.userService.getSession().subscribe({
      next:({data, error}) => {
        
        if (error) {
          console.error(error);
          throw error;
        }
        refreshToken = data.session?.refresh_token;
        this.userId = data.session?.user.id;
        
      }})

      
        this.refreshSub = this.userService.refreshSession(refreshToken).subscribe({
          next: ({data, error}) => {
            if (error) {
              throw error;
            } 
          }
        })
      
  }
  ngOnDestroy(): void {
      this.sessionSub.unsubscribe();
      this.refreshSub.unsubscribe();
  }
}
