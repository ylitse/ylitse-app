import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';

import * as authApi from './auth';

type ApiBuddy = t.TypeOf<typeof buddyType>;

const buddyType = t.intersection([
  t.strict({
    display_name: t.string,
    id: t.string,
  }),
  t.partial({ status: t.literal('banned') }),
]);

export type BanActions = 'Ban' | 'Unban' | 'Delete';
export type BanStatuses = 'Banned' | 'NotBanned' | 'Deleted';
export type BanStatusStrings = 'banned' | 'ok' | 'deleted';

export type Buddy = {
  buddyId: string;
  name: string;
  status: BanStatuses;
};

const toBuddy = ({ id, display_name, status }: ApiBuddy): Buddy => ({
  buddyId: id,
  name: display_name,
  status: status === 'banned' ? 'Banned' : 'NotBanned',
});

export function banActionToStatusString(action: BanActions): BanStatusStrings {
  let statusStr: BanStatusStrings = 'ok';

  if (action === 'Ban') {
    statusStr = 'banned';
  } else if (action === 'Delete') {
    statusStr = 'deleted';
  }

  return statusStr;
}

export function fetchBuddies(
  accessToken: authApi.AccessToken,
): TE.TaskEither<string, Record<string, Buddy>> {
  return http.validateResponse(
    http.get(`${config.baseUrl}/users/${accessToken.userId}/contacts`, {
      headers: authApi.authHeader(accessToken),
    }),
    t.strict({ resources: t.array(buddyType) }),
    ({ resources }) =>
      resources.reduce((acc, apiBuddy) => {
        const buddy = toBuddy(apiBuddy);

        return { ...acc, [buddy.buddyId]: buddy };
      }, {}),
  );
}

const banRequest = (
  buddyId: string,
  accessToken: authApi.AccessToken,
  status: BanActions,
) => {
  return http.put(
    `${config.baseUrl}/users/${accessToken.userId}/contacts/${buddyId}`,
    { status: banActionToStatusString(status) },
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

const batchBanRequest = (
  buddyIds: string[],
  accessToken: authApi.AccessToken,
  status: BanActions,
) => {
  let buddies = [];

  for (const buddyId of buddyIds) {
    buddies.push({ id: buddyId, status: banActionToStatusString(status) });
  }

  return http.patch(
    `${config.baseUrl}/users/${accessToken.userId}/contacts`,
    buddies,
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

export function banBuddy(
  buddyId: string,
  banStatus: BanActions,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddy> {
  return accessToken =>
    http.validateResponse(
      banRequest(buddyId, accessToken, banStatus),
      buddyType,
      toBuddy,
    );
}

export function banBuddies(
  buddyIds: string[],
  banStatus: BanActions,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddy> {
  return accessToken =>
    http.validateResponse(
      batchBanRequest(buddyIds, accessToken, banStatus),
      buddyType,
      toBuddy,
    );
}
