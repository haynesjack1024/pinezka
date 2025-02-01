import { Component, DestroyRef, OnInit } from '@angular/core';
import { ChipComponent } from '../../chip/chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const sortingTypes = ['alpha', 'modified', 'view-count'] as const;
type SortingType = (typeof sortingTypes)[number];

@Component({
  selector: 'app-sorter',
  imports: [ChipComponent, TranslatePipe, NgClass],
  templateUrl: './sorter.component.html',
  styleUrl: './sorter.component.scss',
})
export class SorterComponent implements OnInit {
  protected sorting: string | null = null;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const sorting = params.get('sorting');
        if (sorting === null || sortingTypes.includes(sorting as SortingType)) {
          this.sorting = sorting;
        }
      });
  }

  protected onChipClick(sortingType: SortingType): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sorting: this.sorting !== sortingType ? sortingType : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected readonly sortingTypes = sortingTypes;
}
