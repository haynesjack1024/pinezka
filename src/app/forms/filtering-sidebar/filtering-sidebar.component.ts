import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-filtering-sidebar',
  imports: [TranslatePipe],
  templateUrl: './filtering-sidebar.component.html',
  styleUrl: './filtering-sidebar.component.scss',
})
export class FilteringSidebarComponent {}
