import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { userApiActions } from '../user.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        store.dispatch(userApiActions.sessionExpired());

        return EMPTY;
      }
      throw err;
    }),
  );
};
