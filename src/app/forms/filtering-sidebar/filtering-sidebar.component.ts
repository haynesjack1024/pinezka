import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { CitySelectComponent } from '../../cities/city-select/city-select.component';
import { ExpiryFilterComponent } from '../../posts/expiry-filter/expiry-filter.component';

@Component({
  selector: 'app-filtering-sidebar',
  imports: [
    TranslatePipe,
    CategoryFilterComponent,
    CitySelectComponent,
    ExpiryFilterComponent,
  ],
  templateUrl: './filtering-sidebar.component.html',
  styleUrl: './filtering-sidebar.component.scss',
})
export class FilteringSidebarComponent {}
