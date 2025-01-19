import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLoggedIn } from '../user.reducer';
import { filter, map } from 'rxjs';

export const unauthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectLoggedIn).pipe(
    filter((loggedIn) => loggedIn !== null),
    map((loggedIn) => !loggedIn || router.createUrlTree(['posts'])),
  );
};
