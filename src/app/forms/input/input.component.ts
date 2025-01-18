import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { merge, mergeMap, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit {
  @Input() public type: string = 'text';
  @Input({ required: true }) public label!: string;
  @Input() public controlName?: string;
  @Input() public control?: FormControl;

  protected error$?: Observable<string>;

  public constructor(
    private formGroup: FormGroupDirective,
    private translate: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (this.control && this.controlName) {
      throw new Error(
        'InputComponent: `control` and `controlName` are mutually exclusive.',
      );
    }

    if (this.controlName) {
      const control: AbstractControl | null = this.formGroup.form.get(
        this.controlName,
      );
      if (control) {
        this.control = control as FormControl;
      } else {
        throw new Error(
          'InputComponent: FormControl with the given name does not exist.',
        );
      }
    } else if (this.control === undefined) {
      throw new Error(
        'InputComponent: either `control` or `controlName` has to be provided.',
      );
    }

    this.error$ = merge(
      this.control.statusChanges,
      this.formGroup.ngSubmit,
    ).pipe(mergeMap(() => this.getControlError()));
  }

  private getControlError(): Observable<string> {
    if (
      !this.control?.errors ||
      (!this.formGroup.submitted && this.control.pristine)
    ) {
      return of('');
    }
    const [key, error] = Object.entries(this.control.errors)[0] as [
      string,
      unknown,
    ];

    return this.translate.stream(`form.error.${key}`, error ?? {});
  }
}
