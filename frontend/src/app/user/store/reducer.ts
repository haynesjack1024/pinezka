import { createFeature, createReducer, on } from '@ngrx/store';
import { userApiActions } from './actions';
import { User } from '../models';

interface State {
  readonly user: User | null;
  readonly loggedIn: boolean | null;
}

const initialState: State = {
  user: null,
  loggedIn: null,
};

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(
      userApiActions.loggedInUserFound,
      userApiActions.userLoginSucceeded,
      (state, user) => ({
        ...state,
        user,
        loggedIn: true,
      }),
    ),
    on(
      userApiActions.userLogoutSucceeded,
      userApiActions.sessionExpired,
      (state) => ({
        ...state,
        user: null,
        loggedIn: false,
      }),
    ),
    on(userApiActions.userPatchSucceeded, (state, user) => ({
      ...state,
      user: user,
    })),
  ),
});

export const { name, reducer, selectUserState, selectUser, selectLoggedIn } =
  userFeature;
