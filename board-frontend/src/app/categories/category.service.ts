import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable, shareReplay, combineLatest } from 'rxjs';
import {
  ApiFullCategory,
  CurrentCategory,
  FullCategory,
  SimpleCategory,
} from './models';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url = '/api/post-categories/';

  private readonly currentCategory: Observable<CurrentCategory>;

  public constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {
    this.currentCategory = this.route.queryParamMap.pipe(
      map((params) => {
        const categoryId = params.get('category');

        return categoryId !== null && !isNaN(+categoryId)
          ? parseInt(categoryId)
          : null;
      }),
      mergeMap(
        (categoryId): Observable<CurrentCategory> =>
          categoryId !== null
            ? this.getCategory(categoryId)
            : this.getTopmostCategories(),
      ),
      shareReplay({ refCount: true }),
      takeUntilDestroyed(),
    );
  }

  private getTopmostCategories(): Observable<CurrentCategory> {
    return this.http.get<SimpleCategory[]>(this.url).pipe(
      map((categories) => ({
        subcategories: categories,
      })),
    );
  }

  private getCategory(categoryId: number): Observable<CurrentCategory> {
    return this.http.get<CurrentCategory>(`${this.url}${categoryId}/`);
  }

  public getCurrentCategory(): Observable<CurrentCategory> {
    return this.currentCategory;
  }

  public getAllCategories(): Observable<FullCategory[]> {
    return this.http.get<ApiFullCategory[]>(this.url + 'all/').pipe(
      mergeMap((categories) =>
        combineLatest(
          categories.map((category) =>
            combineLatest(
              category.full_name
                .split('>')
                .map((token) =>
                  this.translate.stream('category.' + token.trim()),
                ),
            ).pipe(
              map(
                (tokens): FullCategory => ({
                  id: category.id,
                  fullName: tokens.join(' > '),
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
