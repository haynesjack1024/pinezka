import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { User, UserLoginDetails } from './models';

export const login = createAction(
  '[Login Component] User signed in',
  props<Partial<UserLoginDetails>>(),
);
export const logout = createAction('[Navbar Component] User signed out');
export const userServiceInit = createAction(
  '[User Service] User Service was initialized',
);

export const userApiActions = createActionGroup({
  source: 'User API',
  events: {
    'No logged in user found': emptyProps(),
    'Logged in user found': props<User>(),
    'User login succeeded': props<User>(),
    'User login failed': emptyProps(),
    'User logout succeeded': emptyProps(),
    'User logout failed': emptyProps(),
  },
});
