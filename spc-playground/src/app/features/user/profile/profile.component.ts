import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUserInfo } from 'src/app/interfaces/User';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  errorMessage: string = '';
  userId: string = '';
  userSub!: Subscription;
  isForEdit: boolean = true;
  user: IUserInfo = {} as IUserInfo;
  updateProfileSub!: Subscription;
  avatarUrl!: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  editInfo() {
    this.isForEdit = !this.isForEdit;
  }

  async updateProfile(form: NgForm): Promise<void | string> {
    if (form.invalid) {
      return;
    }

    const { avatar, first_name, last_name } = form?.form.value;
    let avatar_path = '';

    this.isLoading = true;

    if (avatar) {
      let fileInfo = undefined;

      if (avatar.type !== 'image/jpeg' && avatar.type !== 'image/png') {
        this.isLoading = false;
        return (this.errorMessage = 'File type not supported'!);
      }

      if (avatar.size > 5000000) {
        this.isLoading = false;
        return (this.errorMessage = 'File size greater than 5 MB!');
      }

      try {
        if (!!this.avatarUrl) {
          debugger
          console.log(this.user.avatar_path);
          
          fileInfo = await this.userService.updateUserAvatar(
            this.user.avatar_path,
            avatar
          );
        } else {
          debugger
          fileInfo = await this.userService.uploadAvatar(avatar.name, avatar);
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong!';
        throw error;
      }

      avatar_path = fileInfo.path;
    }

    let obj = {};

    if (!this.avatarUrl) {
      obj = { avatar_path, user_id: this.userId, first_name, last_name };
    } else {
      obj = { user_id: this.userId, first_name, last_name };
    }

    if (!!this.user) {
      this.updateProfileSub = this.userService
        .updateUserInfo(obj, this.userId)
        .subscribe({
          next: ({ data, error }) => {
            if (error) {
              this.errorMessage = error.message;
              this.isLoading = false;
              throw error;
            }

            form.reset();
            this.errorMessage = '';
            this.getUserInfo(this.userId);
          },
          error: (err) => {
            console.error(err);
          },
        });
    } else {
      this.updateProfileSub = this.userService.createUserInfo(obj).subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            this.isLoading = false;
            throw error;
          }

          form.reset();
          this.errorMessage = '';
          this.getUserInfo(this.userId);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
    this.isLoading = true;
  }

  private getUserInfo(userId: string) {
    this.userSub = this.userService.getUserInfo(userId).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (data) {
          this.user = data[0];
        }

        if (this.user.avatar_path) {
          this.avatarUrl = this.userService.getUserAvatarURL(this.user.avatar_path);
        }
      this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.route.snapshot.params['userId'];
    this.getUserInfo(this.userId);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    if (this.updateProfileSub) {
      this.updateProfileSub.unsubscribe();
    }
  }
}
