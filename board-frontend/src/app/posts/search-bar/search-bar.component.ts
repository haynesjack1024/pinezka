import { Component, DestroyRef, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  protected formControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.formControl.setValue(
      this.route.snapshot.queryParamMap.get('search') ?? '',
      { emitEvent: false },
    );
    this.formControl.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) =>
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: value ? value : null },
          queryParamsHandling: 'merge',
        }),
      );
  }

  protected readonly faMagnifyingGlass = faMagnifyingGlass;
}
