import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLoggedIn } from '../store/reducer';
import { filter, map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectLoggedIn).pipe(
    filter((loggedIn) => loggedIn !== null),
    map((loggedIn) => loggedIn || router.createUrlTree(['login'])),
  );
};
