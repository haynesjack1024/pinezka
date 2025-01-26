import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from '../city.service';
import { City } from '../models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-city-select',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './city-select.component.html',
  styleUrl: './city-select.component.scss',
})
export class CitySelectComponent implements OnInit {
  protected cities: City[] = [];
  protected formControl: FormControl<string | null> = new FormControl<
    string | null
  >(null);

  public constructor(
    private citiesService: CityService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.citiesService
      .getCities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cities) => (this.cities = cities));

    this.formControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) =>
        this.router.navigate([], {
          queryParams: { city: value },
          queryParamsHandling: 'merge',
          relativeTo: this.route,
        }),
      );
  }
}
