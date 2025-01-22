import { Component, forwardRef } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type OnChangeFn = (value: string) => unknown;
export type OnTouchedFn = () => unknown;

@Component({
  selector: 'app-search-bar',
  imports: [FaIconComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBarComponent),
      multi: true,
    },
  ],
})
export class SearchBarComponent implements ControlValueAccessor {
  protected value: string = '';
  private onChangeWrapped: OnChangeFn = () => {
    return;
  };
  protected onTouched: OnTouchedFn = () => {
    return;
  };
  protected disabled: boolean = false;

  public writeValue(value: string): void {
    this.value = value;
  }

  protected onChange(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.onChangeWrapped(value);
  }

  public registerOnChange(fn: OnChangeFn): void {
    this.onChangeWrapped = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected readonly faMagnifyingGlass = faMagnifyingGlass;
}
