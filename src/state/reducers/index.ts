import * as automaton from 'redux-automaton';
import * as T from 'fp-ts/lib/Task';

import * as tokenStorage from '../../api/token-storage';
import { cmd } from '../middleware';

import * as types from '../types';

import * as storage from './storage';
import * as accessToken from './accessToken';
import * as login from './login';
import * as createUser from './createUser';
import * as buddies from './buddies';
import * as messages from './messages';
import * as newMessage from './newMessage';
import * as mentors from './mentors';
import * as markSeen from './markSeen';
import * as userAccount from './userAccount';
import * as changePassword from './changePassword';
import * as changeEmail from './changeEmail';
import * as notifications from './notifications';
import * as deleteAccount from './deleteAccount';

import * as actions from '../actions';

import * as RD from '@devexperts/remote-data-ts';

export type AppState = types.AppState;

const exitReducer: automaton.Reducer<AppState, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'logout/logout': {
      return automaton.loop(
        initialState,
        cmd(T.task.map(tokenStorage.purgeToken, _ => actions.none)),
      );
    }
    default: {
      return state;
    }
  }
};

export const rootReducer: automaton.Reducer<AppState, actions.Action> =
  automaton.reducerReducers(
    exitReducer,
    automaton.combineReducers({
      storage: storage.reducer,
      accessToken: accessToken.reducer,
      login: login.reducer,
      createUser: createUser.reducer,
      userAccount: userAccount.reducer,
      changePassword: changePassword.reducer,
      changeEmail: changeEmail.reducer,
      notifications: notifications.reducer,
      deleteAccount: deleteAccount.reducer,

      mentors: mentors.reducer,
      skillFilter: mentors.skillReducer,
      buddies: buddies.reducer,
      messages: messages.reducer,
      newMessage: newMessage.reducer,
      markMessageSeen: markSeen.reducer,
    }),
  );

export const initialState: AppState = {
  storage: storage.initialState,
  accessToken: accessToken.initialState,
  login: login.initialState,
  createUser: createUser.initialState,
  userAccount: userAccount.initialState,
  changePassword: changePassword.initialState,
  changeEmail: changeEmail.initialState,
  notifications: notifications.initialState,
  deleteAccount: deleteAccount.initialState,

  mentors: mentors.initialState,
  skillFilter: [],
  buddies: {
    buddies: buddies.initialState,
    banStatusChangeRequest: RD.initial,
  },
  messages: messages.initialState,
  newMessage: {},
  markMessageSeen: {},
};
