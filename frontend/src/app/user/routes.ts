import { Routes } from '@angular/router';
import { unauthGuard } from './auth/unauth.guard';
import { authGuard } from './auth/auth.guard';
import { NavbarComponent } from '../navbar/navbar.component';

export const userRoutes: Routes = [
  {
    path: 'login',
    canActivate: [unauthGuard],
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    component: NavbarComponent,
    children: [
      {
        path: 'edit',
        loadComponent: () =>
          import('./user-form/user-form.component').then(
            (c) => c.UserFormComponent,
          ),
      },
    ],
  },
];
