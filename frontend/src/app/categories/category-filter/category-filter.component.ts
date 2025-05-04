import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Observable } from 'rxjs';
import { CurrentCategory } from '../models';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-filter',
  imports: [AsyncPipe, TranslatePipe, RouterLink],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit {
  protected category$!: Observable<CurrentCategory>;

  public constructor(private categoryService: CategoryService) {}

  public ngOnInit(): void {
    this.category$ = this.categoryService.getCurrentCategory();
  }
}
