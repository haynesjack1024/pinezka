import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { CitySelectComponent } from '../../cities/city-select/city-select.component';

@Component({
  selector: 'app-filtering-sidebar',
  imports: [TranslatePipe, CategoryFilterComponent, CitySelectComponent],
  templateUrl: './filtering-sidebar.component.html',
  styleUrl: './filtering-sidebar.component.scss',
})
export class FilteringSidebarComponent {}
