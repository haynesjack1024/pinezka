import { Routes } from '@angular/router';
import { userRoutes } from './user/routes';

export const routes: Routes = [
  ...userRoutes,
  {
    path: 'posts',
    loadChildren: () => import('./posts/routes').then((m) => m.postRoutes),
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
