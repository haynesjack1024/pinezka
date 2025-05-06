import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { User, UserLoginDetails, UserPatchRequest } from '../models';

export const login = createAction(
  '[Login Component] User signed in',
  props<Partial<UserLoginDetails>>(),
);
export const logout = createAction('[Navbar Component] User signed out');
export const patch = createAction(
  '[UserForm Component] User submitted an update to their profile',
  props<Partial<UserPatchRequest>>(),
);

export const userApiActions = createActionGroup({
  source: 'User API',
  events: {
    'Logged in user found': props<User>(),
    'User login succeeded': props<User>(),
    'User login failed': emptyProps(),
    'User logout succeeded': emptyProps(),
    'User logout failed': emptyProps(),
    'Session expired': emptyProps(),

    'User patch succeeded': props<User>(),
    'User patch with password change succeeded': props<User>(),
    'User patch failed': emptyProps(),
  },
});
