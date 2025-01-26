import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable, shareReplay } from 'rxjs';
import { CurrentCategory, SimpleCategory } from './models';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url = '/api/post-categories/';

  private readonly currentCategory: Observable<CurrentCategory>;

  public constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
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
}
