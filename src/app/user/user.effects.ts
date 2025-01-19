import {
  Actions,
  createEffect,
  FunctionalEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import {
  catchError,
  debounceTime,
  EMPTY,
  exhaustMap,
  map,
  of,
  tap,
} from 'rxjs';

import { login, logout, userApiActions } from './user.actions';
import { Router } from '@angular/router';
import {
  ToastType,
  TranslatedToastrService,
} from '../translated-toastr.service';
import { ActionCreator } from '@ngrx/store';
import { _ } from '@ngx-translate/core';

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
  actions: ActionCreator[],
  path: string[],
): FunctionalEffect {
  return createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
      actions$.pipe(
        ofType(...actions),
        tap(() => router.navigate(path)),
      ),
    { functional: true, dispatch: false },
  );
}

export const checkIsUserLoggedIn = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      exhaustMap(() =>
        userService.checkSession().pipe(
          map((user) => userApiActions.loggedInUserFound(user)),
          catchError(() => EMPTY),
        ),
      ),
    ),
  { functional: true },
);

export const navigateToLoginPage = createNavigationEffect(
  [userApiActions.sessionExpired, userApiActions.userLogoutSucceeded],
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
  [userApiActions.userLoginSucceeded],
  ['posts'],
);

export const loginSuccessNotif = createNotifEffect(
  userApiActions.userLoginSucceeded,
  _('login.success'),
  'success',
);

export const loginFailureNotif = createNotifEffect(
  userApiActions.userLoginFailed,
  _('login.failure'),
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
  _('logout.success'),
  'success',
);

export const logoutFailureNotif = createNotifEffect(
  userApiActions.userLogoutFailed,
  _('logout.failure'),
  'error',
);
