import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryFilterComponent } from '../../categories/category-filter/category-filter.component';
import { CityFilterComponent } from '../../cities/city-filter/city-filter.component';
import { ExpiryFilterComponent } from '../expiry/expiry-filter/expiry-filter.component';

@Component({
  selector: 'app-filtering-sidebar',
  imports: [
    TranslatePipe,
    CategoryFilterComponent,
    CityFilterComponent,
    ExpiryFilterComponent,
  ],
  templateUrl: './filtering-sidebar.component.html',
  styleUrl: './filtering-sidebar.component.scss',
})
export class FilteringSidebarComponent {}
