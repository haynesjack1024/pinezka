import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  TouchedChangeEvent,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type OnTouchedFn = () => void;
type OnChangeFn = (value: string | null) => void;

@Directive()
export abstract class AbstractInputDirective
  implements OnInit, ControlValueAccessor
{
  protected readonly formControl = new FormControl<string>('');
  private onTouched: OnTouchedFn = () => {
    return;
  };
  private onChange: OnChangeFn = () => {
    return;
  };

  protected error$?: Observable<string>;

  protected readonly ngControl = inject(NgControl);
  protected readonly translate = inject(TranslateService);
  protected readonly destroyRef = inject(DestroyRef);

  public constructor() {
    this.ngControl.valueAccessor = this;
  }

  public ngOnInit(): void {
    this.formControl.events
      .pipe(
        filter((event) => event instanceof TouchedChangeEvent && event.touched),
        tap(this.onTouched),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.formControl.valueChanges
      .pipe(tap(this.onChange), takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.error$ = this.ngControl.control?.statusChanges.pipe(
      switchMap(() => this.getControlError()),
    );
  }

  private getControlError(): Observable<string> {
    if (!this.ngControl.errors || this.formControl.pristine) {
      return of('');
    }
    const [key, error] = Object.entries(this.ngControl.errors)[0] as [
      string,
      unknown,
    ];

    return this.translate.stream(`form.error.${key}`, error ?? {});
  }

  public writeValue(value: string): void {
    this.formControl.setValue(value);
  }

  public registerOnChange(fn: OnChangeFn): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
}
