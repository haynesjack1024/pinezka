import { Routes } from '@angular/router';
import { authGuard } from '../user/auth/auth.guard';

export const postRoutes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
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
