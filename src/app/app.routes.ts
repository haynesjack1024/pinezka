import { Routes } from '@angular/router';
import { userRoutes } from './user/routes';
import { postRoutes } from './posts/routes';

export const routes: Routes = [
  ...userRoutes,
  {
    path: 'posts',
    children: postRoutes,
  },
  {
    path: '',
    redirectTo: '/posts',
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
