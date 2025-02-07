import { Routes } from '@angular/router';
import { userRoutes } from './user/routes';
import { authGuard } from './user/auth/auth.guard';

export const routes: Routes = [
  ...userRoutes,
  {
    path: 'posts',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
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
