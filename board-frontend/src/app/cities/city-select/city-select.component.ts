import { Component, OnInit } from '@angular/core';
import { AbstractInputDirective } from '../../forms/abstract-input/abstract-input.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { City } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CityService } from '../city.service';
import { tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-city-select',
  imports: [ReactiveFormsModule, AsyncPipe, TranslatePipe],
  templateUrl: './city-select.component.html',
  styleUrl: './city-select.component.scss',
})
export class CitySelectComponent
  extends AbstractInputDirective
  implements OnInit
{
  protected cities: City[] = [];

  public constructor(private cityService: CityService) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.cityService
      .getCities()
      .pipe(
        tap((cities) => (this.cities = cities)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
