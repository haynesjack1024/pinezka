import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { InputComponent } from '../../forms/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs';
import { TranslatedToastrService } from '../../translated-toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public constructor(
    private userService: UserService,
    private translatedToastr: TranslatedToastrService,
    private router: Router,
  ) {}

  protected readonly formGroup = new FormGroup({
    username: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  protected submit(): void {
    this.userService
      .login(this.formGroup.value)
      .pipe(
        tap(() => this.translatedToastr.show('toast.signed-in', 'success')),
        catchError((err) => {
          this.translatedToastr.show('toast.error', 'error');
          throw err;
        }),
      )
      .subscribe(() => this.router.navigate(['posts']));
  }
}
