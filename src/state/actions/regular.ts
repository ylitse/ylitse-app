import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import * as accountApi from '../../api/account';
import * as notificationsApi from '../../api/notifications';
import * as mentorApi from '../../api/mentors';
import * as authApi from '../../api/auth';
import * as buddyApi from '../../api/buddies';
import * as messageApi from '../../api/messages';

type RegularActions = {
  'none/none': undefined;
  'logout/logout': undefined;
  'deleteAccount/start': undefined;
  'deleteAccount/end': Result<typeof accountApi.deleteAccount>;

  'storage/readToken/start': undefined;
  'storage/readToken/end': E.Either<string, authApi.AccessToken>;
  'storage/writeToken/start': authApi.AccessToken;
  'storage/writeToken/end': undefined;

  'mentors/start': undefined;
  'mentors/end': Result<typeof mentorApi.fetchMentors>;

  'skillFilter/toggled': { skillName: string };
  'skillFilter/reset': undefined;

  'login/start': authApi.Credentials;
  'login/end': Result<typeof authApi.login>;

  'createUser/start': accountApi.User;
  'createUser/end': Result<typeof accountApi.createUser>;

  'userAccount/get/start': undefined;
  'userAccount/get/completed': Result<typeof accountApi.getMyUser>;

  'changePassword/start': authApi.NewPassword;
  'changePassword/completed': Result<ReturnType<typeof authApi.changePassword>>;
  'changePassword/reset': undefined;

  'changeEmail/start': { email?: string; account?: accountApi.UserAccount };
  'changeEmail/completed': E.Either<string, { email?: string }>;
  'changeEmail/reset': undefined;

  'token/Acquired': authApi.AccessToken;
  'token/refresh/start': undefined;
  'token/refresh/end': Result<typeof authApi.refreshAccessToken>;

  'token/doRequest/init': {
    task: (token: authApi.AccessToken) => any;
    action: (result: any) => Action;
  };
  'token/doRequest/completed': {
    index: string;
    result: any;
  };

  'token/refresh/required': (token: authApi.AccessToken) => Action;

  'messages/get/completed': Result<typeof messageApi.fetchMessages>;
  'messages/markSeen': { message: messageApi.Message };
  'messages/markSeen/end': undefined;

  'buddies/completed': Result<typeof buddyApi.fetchBuddies>;
  'buddies/changeBanStatus/start': {
    buddyId: string;
    banStatus: buddyApi.BanActions;
  };
  'buddies/changeBanStatusBatch/start': {
    buddyIds: string[];
    banStatus: buddyApi.BanActions;
  };
  'buddies/changeStatus/end': E.Either<string, buddyApi.Buddy>;

  'newMessage/send/start': messageApi.SendMessageParams;
  'newMessage/send/end': {
    buddyId: string;
    response: Result<ReturnType<typeof messageApi.sendMessage>>;
  };

  'newMessage/store/write/start': messageApi.SendMessageParams;
  'newMessage/store/write/end': messageApi.SendMessageParams;
  'newMessage/store/read/start': { buddyId: string };
  'newMessage/store/read/end': messageApi.SendMessageParams;

  'notifications/requestPermissions/init': undefined;
  'notifications/requestPermissions/completed': TE2E<
    typeof notificationsApi.requestPermissions
  >;
  'notifications/sendDeviceToken/init': undefined;
  'notifications/sendDeviceToken/completed': Result<
    typeof notificationsApi.sendDeviceToken
  >;
};

// TODO name plz.
type TE2E<T> = T extends TE.TaskEither<infer Left, infer Right>
  ? E.Either<Left, Right>
  : never;

// TODO: handle curried case, Exists under the name "FinalReturn" in
// git history somewhere, use git log -S
type Result<F extends (...args: any[]) => any> = TE2E<ReturnType<F>>;
// https://github.com/microsoft/TypeScript/issues/23182
//type Payload<T> = [T] extends [never] ? {} : { payload: T };
export type ActionType = keyof RegularActions;
export type Action = {
  [Type in ActionType]: {
    type: Type;
    payload: RegularActions[Type];
  };
}[ActionType];

export function make<T extends ActionType, P extends RegularActions[T]>(
  type: T,
): (payload: P) => {
  type: T;
  payload: P;
} {
  return (payload: P) => ({ type, payload });
}
