import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import * as authApi from '../api/auth';
import * as accountApi from '../api/account';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

export type indexStr = string;
export type BuddyId = string;
export type Err = string;
export type RemoteData<A> = RD.RemoteData<Err, A>;
export type RemoteAction = RemoteData<undefined>;

export type AppState = {
  storage: {
    readToken: RemoteData<authApi.AccessToken>;
    writeToken: RemoteData<void>;
  };

  accessToken: {
    currentToken: O.Option<authApi.AccessToken>;
    nextToken: RemoteData<authApi.AccessToken>;
    index: number;
    tasks: Record<indexStr, { task: any; action: any }>;
    deferredTasks: { task: any; action: any }[];
  };

  login: RemoteData<authApi.AccessToken>;
  createUser: RemoteData<authApi.AccessToken>;
  changePassword: RemoteAction;
  changeEmail: RemoteData<{ email?: string }>;
  userAccount: RemoteData<accountApi.UserAccount>;

  deleteAccount: RemoteAction;

  mentors: RemoteData<Record<BuddyId, mentorsApi.Mentor>>;
  skillFilter: string[];
  buddies: {
    buddies: RemoteData<Record<BuddyId, buddyApi.Buddy>>;
    banStatusChangeRequest: RemoteAction;
  };

  messages: {
    polling: boolean;
    messages: RemoteData<messageApi.Threads>;
  };
  newMessage: Record<
    BuddyId,
    {
      sendRequest: RemoteAction;
      text: string;
    }
  >;
  markMessageSeen: Record<string, boolean>;
  notifications: {
    requestPermissions: RemoteData<boolean>;
    sendDeviceToken: RemoteAction;
  };
};
