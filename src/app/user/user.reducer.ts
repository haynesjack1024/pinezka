import { createFeature, createReducer, on } from '@ngrx/store';
import { userApiActions } from './user.actions';
import { User } from './models';

interface State {
  readonly user: User | null;
}

const initialState: State = {
  user: null,
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
      }),
    ),
    on(userApiActions.userLogoutSucceeded, (state) => ({
      ...state,
      user: null,
    })),
  ),
});

export const { name, reducer, selectUserState, selectUser } = userFeature;
