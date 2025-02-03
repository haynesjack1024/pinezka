import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, combineLatest } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paginator',
  imports: [AsyncPipe, RouterLink, FaIconComponent, NgClass],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  protected readonly initialPageNumber: number = 1;
  private readonly pageSize: number = 1;
  private readonly maxTileCount: number = 5;
  private readonly tileRangeMiddle: number = Math.round(this.maxTileCount / 2);

  @Input({ required: true }) public set entriesCount(value: number) {
    this.entriesCount$.next(value);
  }
  private readonly entriesCount$ = new BehaviorSubject<number>(0);
  protected readonly pageCount$: Observable<number> = this.entriesCount$.pipe(
    map((entriesCount) => Math.max(Math.ceil(entriesCount / this.pageSize), 1)),
  );

  protected tiles$!: Observable<number[]>;
  protected readonly currentPageNumber$ = new BehaviorSubject<number>(
    this.initialPageNumber,
  );
  protected isFirstPage$!: Observable<boolean>;
  protected isLastPage$!: Observable<boolean>;

  public constructor(
    protected route: ActivatedRoute,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.tiles$ = this.route.queryParamMap.pipe(
      this.mapParamsToPageNumber(),
      tap((pageNumber) => this.currentPageNumber$.next(pageNumber)),
      this.mapPageNumberToTileRange(),
    );

    this.isFirstPage$ = this.currentPageNumber$.pipe(
      map((currentPageNumber) => currentPageNumber === 1),
    );

    this.isLastPage$ = combineLatest([
      this.pageCount$,
      this.currentPageNumber$,
    ]).pipe(
      map(([pageCount, currentPageNumber]) => currentPageNumber === pageCount),
    );
  }

  private mapParamsToPageNumber() {
    return (params$: Observable<ParamMap>): Observable<number> =>
      combineLatest([
        params$.pipe(map((params) => params.get('page-number'))),
        this.pageCount$,
      ]).pipe(
        map(([pageNumber, pageCount]) => {
          if (pageNumber === null) {
            return this.initialPageNumber;
          }

          const parsedPageNumber = parseInt(pageNumber);
          if (
            isNaN(parsedPageNumber) ||
            parsedPageNumber < 1 ||
            parsedPageNumber > pageCount
          ) {
            void this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { 'page-number': null },
              queryParamsHandling: 'merge',
            });

            return this.initialPageNumber;
          }

          return parsedPageNumber;
        }),
      );
  }

  private mapPageNumberToTileRange() {
    return (pageNumber$: Observable<number>): Observable<number[]> =>
      combineLatest([pageNumber$, this.pageCount$]).pipe(
        map(([pageNumber, pageCount]) => {
          const tileRangeStart = this.getTileRangeStart(pageNumber, pageCount);
          const tileRangeSize = this.getTileRangeSize(pageCount);

          return Array(tileRangeSize)
            .fill(0)
            .map((_, i) => i + tileRangeStart);
        }),
      );
  }

  private getTileRangeStart(pageNumber: number, pageCount: number): number {
    if (pageCount <= this.maxTileCount || pageNumber < this.tileRangeMiddle) {
      return 1;
    } else if (pageNumber > pageCount - this.tileRangeMiddle) {
      return pageCount - this.maxTileCount + 1;
    }

    return pageNumber - this.tileRangeMiddle + 1;
  }

  private getTileRangeSize(pageCount: number): number {
    return Math.min(this.maxTileCount, pageCount);
  }

  protected readonly faAnglesLeft = faAnglesLeft;
  protected readonly faAngleLeft = faAngleLeft;
  protected readonly faAngleRight = faAngleRight;
  protected readonly faAnglesRight = faAnglesRight;
}
