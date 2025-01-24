import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Category, Subcategory } from './models';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-filter',
  imports: [AsyncPipe, TranslatePipe, RouterLink],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit {
  protected readonly categories$: BehaviorSubject<Category[]> =
    new BehaviorSubject<Category[]>([]);

  protected readonly parent$: Observable<Omit<
    Category,
    'subcategories'
  > | null> = this.categories$.pipe(
    map((categories) =>
      categories.length === 1
        ? {
            id: categories[0].id,
            name: categories[0].name,
            parent: categories[0].parent,
          }
        : null,
    ),
  );

  protected readonly subcategories$: Observable<Subcategory[]> =
    this.categories$.pipe(
      map((categories) =>
        categories.length === 1 ? categories[0].subcategories : categories,
      ),
    );

  public constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => {
          const category = params.get('category');

          return category !== null && !isNaN(+category)
            ? parseInt(category)
            : null;
        }),
      )
      .subscribe((categoryId: number | null) => {
        if (categoryId === null) {
          this.categoryService
            .getTopmostCategories()
            .subscribe((categories) => this.categories$.next(categories));
        } else {
          this.categoryService
            .getCategory(categoryId)
            .subscribe((category) => this.categories$.next([category]));
        }
      });
  }
}
