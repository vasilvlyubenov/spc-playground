import { Component, OnInit } from '@angular/core';
import { UserService } from './features/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'spc-playground';

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<any> {
    const session = await this.userService.getSession();

    if (session) {
      this.userService
        .refreshSession({ refresh_token: session?.access_token })
        .subscribe({
          next({ data, error }) {
            if (error) {
              if (error.name === 'AuthApiError') {
                throw error;
              }
            }
          },
        });
    }
  }
}
