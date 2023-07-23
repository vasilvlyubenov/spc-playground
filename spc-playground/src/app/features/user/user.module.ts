import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxMatFileInputModule  } from '@angular-material-components/file-input';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    UserRoutingModule,
    MatIconModule,
    FormsModule,
    NgxMatFileInputModule
  ],
})
export class UserModule { }
