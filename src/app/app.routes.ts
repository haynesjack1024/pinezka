import { Routes } from '@angular/router';
import { userRoutes } from './user/routes';

export const routes: Routes = [
  ...userRoutes,
  {
    path: 'posts',
    loadComponent: () =>
      import('./posts/post-list/post-list.component').then(
        (c) => c.PostListComponent,
      ),
  },
  {
    path: '',
    redirectTo: '/users/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (c) => c.NotFoundComponent,
      ),
  },
];
