import { Actions, createEffect, FunctionalEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { catchError, debounceTime, exhaustMap, map, of, tap } from 'rxjs';

import { login, logout, userApiActions, userServiceInit } from './user.actions';
import { Router } from '@angular/router';
import {
  ToastType,
  TranslatedToastrService,
} from '../translated-toastr.service';
import { ActionCreator } from '@ngrx/store';

function createNotifEffect(
  action: ActionCreator,
  key: string,
  type: ToastType,
): FunctionalEffect {
  return createEffect(
    (
      actions$ = inject(Actions),
      translatedToastr = inject(TranslatedToastrService),
    ) =>
      actions$.pipe(
        ofType(action),
        debounceTime(1),
        tap(() => translatedToastr.show(key, type)),
      ),
    { functional: true, dispatch: false },
  );
}

function createNavigationEffect(
  action: ActionCreator,
  path: string[],
): FunctionalEffect {
  return createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
      actions$.pipe(
        ofType(action),
        tap(() => router.navigate(path)),
      ),
    { functional: true, dispatch: false },
  );
}

export const checkIsUserLoggedIn = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(userServiceInit),
      exhaustMap(() =>
        userService.checkSession().pipe(
          map((user) => userApiActions.loggedInUserFound(user)),
          catchError(() => of(userApiActions.noLoggedInUserFound())),
        ),
      ),
    ),
  { functional: true },
);

export const navigateToLoginPage = createNavigationEffect(
  userApiActions.noLoggedInUserFound,
  ['login'],
);

export const loginUser = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(login),
      exhaustMap((loginDetails) =>
        userService.login(loginDetails).pipe(
          map((user) => userApiActions.userLoginSucceeded(user)),
          catchError(() => of(userApiActions.userLoginFailed())),
        ),
      ),
    ),
  { functional: true },
);

export const navigateToPosts = createNavigationEffect(
  userApiActions.userLoginSucceeded,
  ['posts'],
);

export const loginSuccessNotif = createNotifEffect(
  userApiActions.userLoginSucceeded,
  'login.success',
  'success',
);

export const loginFailureNotif = createNotifEffect(
  userApiActions.userLoginFailed,
  'login.failure',
  'error',
);

export const logoutUser = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        userService.logout().pipe(
          map(() => userApiActions.userLogoutSucceeded()),
          catchError(() => of(userApiActions.userLogoutFailed())),
        ),
      ),
    ),
  { functional: true },
);

export const logoutSuccessNotif = createNotifEffect(
  userApiActions.userLogoutSucceeded,
  'logout.success',
  'success',
);

export const logoutFailureNotif = createNotifEffect(
  userApiActions.userLogoutFailed,
  'logout.failure',
  'error',
);
