import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlEvent,
  ControlValueAccessor,
  FormControl,
  NgControl,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  filter,
  Observable,
  of,
  Subscription,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type OnTouchedFn = () => void;
type OnChangeFn = (value: unknown) => void;

@Directive()
export abstract class AbstractInputDirective
  implements OnInit, ControlValueAccessor
{
  protected readonly formControl = new FormControl<unknown>(undefined);
  private onTouched: OnTouchedFn = () => {
    return;
  };
  private onChange: OnChangeFn = () => {
    return;
  };

  protected readonly errorTranslationPrefix: string = '';
  protected readonly customErrorTranslations: string[] = [];
  private readonly lastError$ = new BehaviorSubject<string>('');
  private lastErrorTranslationSub?: Subscription;

  protected get error$(): Observable<string> {
    return this.lastError$.asObservable();
  }

  protected readonly ngControl = inject(NgControl);
  protected readonly translate = inject(TranslateService);
  protected readonly destroyRef = inject(DestroyRef);

  public constructor() {
    this.ngControl.valueAccessor = this;

    if (this.customErrorTranslations.length && !this.errorTranslationPrefix) {
      throw new Error(
        'AbstractInputDirective: Improperly extended, ' +
          'provided customErrorTranslations without errorTranslationPrefix',
      );
    }
  }

  public ngOnInit(): void {
    this.formControl.events
      .pipe(
        filter((event) => event instanceof TouchedChangeEvent && event.touched),
        tap(() => this.onTouched()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.formControl.valueChanges
      .pipe(
        tap((value) => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.ngControl.control?.events
      .pipe(
        filter(
          (event) =>
            event instanceof TouchedChangeEvent ||
            event instanceof StatusChangeEvent,
        ),
        tap((event: ControlEvent) => this.setLastError(event.source)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private setLastError(control: AbstractControl): void {
    this.lastErrorTranslationSub?.unsubscribe();
    this.lastErrorTranslationSub = this.getLastErrorTranslation(
      control,
    ).subscribe((translation) => this.lastError$.next(translation));
  }

  private getLastErrorTranslation(
    control: AbstractControl,
  ): Observable<string> {
    if (!control.errors || control.untouched) {
      return of('');
    }
    const [key, error] = Object.entries(control.errors)[0] as [string, unknown];

    return this.translate.stream(
      `form.error.${this.getErrorTranslationKey(key)}`,
      error ?? {},
    );
  }

  private getErrorTranslationKey(errorName: string): string {
    if (!this.customErrorTranslations.includes(errorName)) {
      return errorName;
    }

    return this.errorTranslationPrefix + '.' + errorName;
  }

  public writeValue(value: unknown): void {
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
