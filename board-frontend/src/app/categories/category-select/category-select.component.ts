import { Component } from '@angular/core';
import { AbstractInputDirective } from '../../forms/abstract-input/abstract-input.directive';
import { CategoryService } from '../category.service';
import { FullCategory } from '../models';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category-select',
  imports: [AsyncPipe, ReactiveFormsModule, TranslatePipe],
  templateUrl: './category-select.component.html',
  styleUrl: './category-select.component.scss',
})
export class CategorySelectComponent extends AbstractInputDirective {
  protected categories: FullCategory[] = [];

  public constructor(private categoryService: CategoryService) {
    super();
    this.categoryService
      .getAllCategories()
      .pipe(
        tap((categories) => (this.categories = categories)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected readonly NaN = NaN;
}
