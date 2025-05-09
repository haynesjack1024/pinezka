import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AdditionalFields, User } from '../models';
import { selectUser } from '../store/reducer';
import { filter, first, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patch } from '../store/actions';
import { InputComponent } from '../../forms/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalComponent } from '../../modal/modal.component';
import { BackButtonComponent } from '../../back-button/back-button.component';

type AdditionFieldFormGroup = FormGroup<{
  name: FormControl<string>;
  value: FormControl<string>;
}>;

type UserFormGroup = FormGroup<{
  id: FormControl<number>;
  username: FormControl<string>;
  email: FormControl<string>;
  changePassword: FormControl<boolean>;
  password: FormControl<string>;
  additionalFields: FormArray<AdditionFieldFormGroup>;
}>;

@Component({
  selector: 'app-user-form',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    TranslatePipe,
    ModalComponent,
    BackButtonComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private user$!: Observable<User | null>;
  protected formGroup?: UserFormGroup;
  @ViewChild(ModalComponent) protected modal!: ModalComponent;

  public constructor(
    private store: Store,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
    this.user$
      .pipe(
        filter((user) => user !== null),
        first(),
        tap((user) => {
          this.formGroup = this.createFormGroup(user);
          this.formGroup.controls.changePassword.valueChanges
            .pipe(
              tap((changePassword) => {
                if (changePassword) {
                  this.formGroup?.controls.password.enable();
                } else {
                  this.formGroup?.controls.password.reset();
                  this.formGroup?.controls.password.disable();
                }
              }),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private createFormGroup(user: User): UserFormGroup {
    return new FormGroup({
      id: new FormControl<number>(user.id, { nonNullable: true }),
      username: new FormControl<string>(user.username, {
        validators: Validators.required,
        nonNullable: true,
      }),
      email: new FormControl<string>(user.email, {
        validators: Validators.required,
        nonNullable: true,
      }),
      changePassword: new FormControl<boolean>(false, {
        validators: [Validators.minLength(6)],
        nonNullable: true,
      }),
      password: new FormControl<string>(
        { value: '', disabled: true },
        { nonNullable: true },
      ),
      additionalFields: new FormArray(
        this.getControlsFromAdditionalFields(user.additionalFields),
      ),
    });
  }

  private getControlsFromAdditionalFields(
    additionalFields: AdditionalFields[],
  ): AdditionFieldFormGroup[] {
    return additionalFields.map((additionalField) =>
      this.getAdditionalField(additionalField.name, additionalField.value),
    );
  }

  protected addAdditionalField(): void {
    this.formGroup?.controls.additionalFields.push(this.getAdditionalField());
  }

  protected getAdditionalField(
    initialFieldName: string = '',
    initialValue: string = '',
  ): AdditionFieldFormGroup {
    return new FormGroup({
      name: new FormControl<string>(initialFieldName, {
        validators: Validators.required,
        nonNullable: true,
      }),
      value: new FormControl<string>(initialValue, {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  protected removeAdditionalField(controlId: number): void {
    this.formGroup?.controls.additionalFields.removeAt(controlId);
  }

  protected onSubmit(): void {
    this.modal.show();
  }

  protected onConfirm(): void {
    const user = this.formGroup?.value;
    if (user) {
      this.store.dispatch(patch(user));
    }
  }
}
