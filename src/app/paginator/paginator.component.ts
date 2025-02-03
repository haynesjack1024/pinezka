import {
  Component,
  Inject,
  InjectionToken,
  Input,
  OnInit,
} from '@angular/core';
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

export const DEFAULT_PAGE_SIZE = new InjectionToken<number>(
  'The default page size if none is given.',
);
export const DEFAULT_PAGE_NUMBER = new InjectionToken<number>(
  'The default page number if none is given.',
);

@Component({
  selector: 'app-paginator',
  imports: [AsyncPipe, RouterLink, FaIconComponent, NgClass],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  private readonly maxTileCount: number = 5;
  private readonly tileRangeMiddle: number = Math.round(this.maxTileCount / 2);

  @Input({ required: true }) public entriesCount$!: Observable<number>;
  protected pageCount$!: Observable<number>;

  protected tiles$!: Observable<number[]>;
  protected currentPageNumber$!: BehaviorSubject<number>;
  protected isFirstPage$!: Observable<boolean>;
  protected isLastPage$!: Observable<boolean>;

  public constructor(
    protected route: ActivatedRoute,
    private router: Router,
    @Inject(DEFAULT_PAGE_NUMBER) protected defaultPageNumber: number,
    @Inject(DEFAULT_PAGE_SIZE) private defaultPageSize: number,
  ) {}

  public ngOnInit(): void {
    this.currentPageNumber$ = new BehaviorSubject(this.defaultPageNumber);
    this.pageCount$ = this.getPageCount();
    this.tiles$ = this.getTiles();
    this.isFirstPage$ = this.getIsFirstPage();
    this.isLastPage$ = this.getIsLastPage();
  }

  private getPageCount(): Observable<number> {
    return this.entriesCount$.pipe(
      map((entriesCount) =>
        Math.max(Math.ceil(entriesCount / this.defaultPageSize), 1),
      ),
    );
  }

  private getTiles(): Observable<number[]> {
    return this.route.queryParamMap.pipe(
      this.mapParamsToPageNumber(),
      tap((pageNumber) => this.currentPageNumber$.next(pageNumber)),
      this.mapPageNumberToTileRange(),
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
            return this.defaultPageNumber;
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

            return this.defaultPageNumber;
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

  private getIsFirstPage(): Observable<boolean> {
    return this.currentPageNumber$.pipe(
      map((currentPageNumber) => currentPageNumber === 1),
    );
  }

  private getIsLastPage(): Observable<boolean> {
    return combineLatest([this.pageCount$, this.currentPageNumber$]).pipe(
      map(([pageCount, currentPageNumber]) => currentPageNumber === pageCount),
    );
  }

  protected readonly faAnglesLeft = faAnglesLeft;
  protected readonly faAngleLeft = faAngleLeft;
  protected readonly faAngleRight = faAngleRight;
  protected readonly faAnglesRight = faAnglesRight;
}
