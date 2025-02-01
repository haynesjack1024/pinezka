import { Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

export const postRoutes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./post-list/post-list.component').then(
            (c) => c.PostListComponent,
          ),
        children: [
          {
            path: 'form',
            loadComponent: () =>
              import('./post-form/post-form.component').then(
                (c) => c.PostFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./post-details/post-details.component').then(
                (c) => c.PostDetailsComponent,
              ),
          },
        ],
      },
    ],
  },
];
