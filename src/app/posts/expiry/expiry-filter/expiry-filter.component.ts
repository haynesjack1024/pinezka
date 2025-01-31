import { Component, DestroyRef, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-expiry-filter',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './expiry-filter.component.html',
  styleUrl: './expiry-filter.component.scss',
})
export class ExpiryFilterComponent implements OnInit {
  protected readonly formControl = new FormControl<boolean>(false);

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe((params) =>
        this.formControl.setValue(params.get('expired') === 'true', {
          emitEvent: false,
        }),
      );

    this.formControl.valueChanges
      .pipe(
        map((value) => (value ? true : null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) =>
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { expired: value },
          queryParamsHandling: 'merge',
        }),
      );
  }
}
