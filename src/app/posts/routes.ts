import { Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

export const postRoutes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./post-list/post-list.component').then(
            (c) => c.PostListComponent,
          ),
      },
    ],
  },
];
