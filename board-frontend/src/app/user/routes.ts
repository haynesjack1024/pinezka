import { Routes } from '@angular/router';
import { unauthGuard } from './auth/unauth.guard';

export const userRoutes: Routes = [
  {
    path: 'login',
    canActivate: [unauthGuard],
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
];
