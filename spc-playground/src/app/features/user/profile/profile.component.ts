import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUserInfo } from 'src/app/interfaces/User';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  user!: IUserInfo;
  updateProfileSub!: Subscription;
  avatar!: File | Blob;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  async updateProfile(form: NgForm): Promise<void | string> {
    if (form.invalid) {
      return;
    }
    debugger
    const { avatar, first_name, last_name } = form?.form.value;
    let avatar_path = '';

    this.isLoading = true;

    if (avatar) {
      let fileInfo = undefined;
      const avatarNameArr = avatar.name.split('.');
      const fileExtension = avatarNameArr[avatarNameArr.length - 1];
      console.log(fileExtension);
      console.log(fileExtension !== 'jpeg');
      
      if (fileExtension.match(/\.(jpg|jpeg|png)$/i)) {
        this.isLoading = false;
        return (this.errorMessage = 'File extension not supported!');
      }

      if (avatar.size > 5000000) {
        this.isLoading = false;
        return (this.errorMessage = 'File size greater than 5 MB!');
      }

      try {
        if (this.avatar) {
          fileInfo = await this.userService.updateUserAvatar(
            this.user.avatar_path,
            avatar
          );
        } else {
          fileInfo = await this.userService.uploadAvatar(avatar.name, avatar);
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong!';
        throw error;
      }

      avatar_path = fileInfo.path;
    }

    if (!this.user) {
      this.updateProfileSub = this.userService
      .updateUserInfo({ avatar_path, user_id: this.userId, first_name, last_name }, this.userId)
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            this.isLoading = false;
            throw error;
          }

          form.reset();
          this.errorMessage = '';
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.updateProfileSub = this.userService
      .createUserInfo({ avatar_path, user_id: this.userId, first_name, last_name })
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message;
            this.isLoading = false;
            throw error;
          }

          form.reset();
          this.errorMessage = '';
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  async ngOnInit(): Promise<void> {
    this.userId = this.route.snapshot.params['userId'];
    console.log(this.userId);
    this.userSub = this.userService.getUserInfo(this.userId).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (data) {
          this.user = data;
        }
      },
    });

    if (this.user) {
      this.avatar = await this.userService.getUserAvatar(this.user.avatar_path);
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    if (this.updateProfileSub) {
      this.updateProfileSub.unsubscribe();
    }
  }
}
