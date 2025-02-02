import { Component, OnInit } from '@angular/core';
import { AbstractInputDirective } from '../../../forms/abstract-input/abstract-input.directive';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'app-expiry-input',
  imports: [AsyncPipe, ReactiveFormsModule, TranslatePipe],
  templateUrl: './expiry-input.component.html',
  styleUrl: './expiry-input.component.scss',
})
export class ExpiryInputComponent
  extends AbstractInputDirective
  implements OnInit
{
  protected override readonly errorTranslationPrefix: string = 'expiry-input';
  protected override readonly customErrorTranslations: string[] = [
    'min',
    'max',
  ];

  protected readonly dateRangeFormat: string = 'YYYY-MM-DD';

  protected readonly min: Dayjs = dayjs();
  protected readonly max: Dayjs = dayjs().add(6, 'months');
  protected readonly minDisplay: string = this.format(this.min);
  protected readonly maxDisplay: string = this.format(this.max);

  public override ngOnInit(): void {
    super.ngOnInit();
    this.ngControl.control?.addValidators(this.dateRangeValidator);
  }

  private format(date: Date | Dayjs): string {
    return (date instanceof Date ? dayjs(date) : date).format(
      this.dateRangeFormat,
    );
  }

  private dateRangeValidator = (
    (min: Dayjs, max: Dayjs) =>
    (control: AbstractControl): ValidationErrors | null => {
      const parsedValue = dayjs(control.value);
      if (parsedValue.isBefore(min)) {
        return { min: {} };
      }
      if (parsedValue.isAfter(max)) {
        return { max: {} };
      }

      return null;
    }
  )(this.min, this.max);

  public override writeValue(value: Date): void {
    super.writeValue(this.format(dayjs(value)));
  }
}
