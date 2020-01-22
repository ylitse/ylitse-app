import * as redux from 'redux';
import * as sagaEffects from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import * as remoteData from '../lib/remote-data';
import * as actionsUnion from '../lib/actions-union';
import { makeSaga } from '../lib/remote-data-saga';

import * as mentorsApi from '../api/mentors';
import * as authApi from '../api/auth';

export type State = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
  accessToken: remoteData.RemoteData<authApi.AccessToken>;
};
export const initialState = {
  mentors: remoteData.notAsked,
  accessToken: remoteData.notAsked,
};

export const {
  actions: mentorsActions,
  reducer: mentorsReducer,
  saga: mentorsSaga,
} = makeSaga(
  'fetchMentors',
  'fetchMentorsSucceed',
  'fetchMentorsFail',
  mentorsApi.fetchMentors,
);

export const {
  actions: loginActions,
  reducer: loginReducer,
  saga: loginSaga,
} = makeSaga('login', 'loginSucceed', 'loginFail', authApi.login);

// MERGE ACTIONS
export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;
export const actions = {
  ...mentorsActions,
  ...loginActions,
};

// MERGE REDUCERS
export function rootReducer(state: State | undefined, action: Action): State {
  if (state === undefined) {
    return initialState;
  }
  return {
    ...state,
    mentors: mentorsReducer(state.mentors, action),
    accessToken: loginReducer(state.accessToken, action),
  };
}

// MERGE SAGAS
export function* rootSaga() {
  yield sagaEffects.all([mentorsSaga(), loginSaga()]);
}

// INIT REDUX STORE
const sagaMiddleware = createSagaMiddleware();
export const store = redux.createStore(
  rootReducer,
  initialState,
  redux.applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);
