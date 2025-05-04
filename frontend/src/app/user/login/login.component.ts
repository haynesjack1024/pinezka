import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../forms/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { login } from '../store/actions';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public constructor(private store: Store) {}

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
    this.store.dispatch(login(this.formGroup.value));
  }
}
