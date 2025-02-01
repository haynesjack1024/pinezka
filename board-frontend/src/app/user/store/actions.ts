import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { User, UserLoginDetails } from '../models';

export const login = createAction(
  '[Login Component] User signed in',
  props<Partial<UserLoginDetails>>(),
);
export const logout = createAction('[Navbar Component] User signed out');

export const userApiActions = createActionGroup({
  source: 'User API',
  events: {
    'Logged in user found': props<User>(),
    'User login succeeded': props<User>(),
    'User login failed': emptyProps(),
    'User logout succeeded': emptyProps(),
    'User logout failed': emptyProps(),
    'Session expired': emptyProps(),
  },
});
