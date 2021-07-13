import * as O from 'fp-ts/lib/Option';
import { getOptionM } from 'fp-ts/lib/OptionT';
import { getFoldableComposition } from 'fp-ts/lib/Foldable';
import * as record from 'fp-ts/lib/Record';
import * as array from 'fp-ts/lib/Array';
import { monoidAny } from 'fp-ts/lib/Monoid';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constant } from 'fp-ts/lib/function';

import * as mentorsApi from '../api/mentors';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';
import * as buddyApi from '../api/buddies';
import * as authApi from '../api/auth';

import { AppState } from './types';

export function getMentors(
  mentors: RD.RemoteData<string, Record<string, mentorsApi.Mentor>>,
): RD.RemoteData<string, mentorApi.Mentor[]> {
  return RD.remoteData.map(mentors, Object.values);
}

export const getAccessToken = ({ accessToken }: AppState) =>
  accessToken.currentToken;

export const getAC = flow(
  getAccessToken,
  O.getOrElse(constant(authApi.invalidToken)),
);

export const getAccount = (state: AppState) =>
  pipe(RD.toOption(state.userAccount), O.toUndefined);

export const getBuddyName = (
  buddyId: string,
  buddyState: AppState['buddies']['buddies'],
  mentorState: AppState['mentors'],
) => {
  const look = (fa: RD.RemoteData<unknown, Record<string, { name: string }>>) =>
    RD.remoteData.map(fa, a => record.lookup(buddyId, a));

  const buddy = getOptionM(RD.remoteData).alt(look(buddyState), () =>
    look(mentorState),
  );

  return getFoldableComposition(RD.remoteData, O.option).reduce(
    buddy,
    '',
    (_, { name }) => name,
  );
};

export const getIsBanned =
  (buddyId: string): (({ buddies: remoteBuddies }: AppState) => boolean) =>
  ({ buddies: remoteBuddies }: AppState): boolean => {
    return pipe(
      remoteBuddies.buddies,
      RD.map(({ [buddyId]: buddy }) => {
        return buddy ? buddy.status === 'Banned' : false;
      }),
      RD.getOrElse<unknown, boolean>(() => true),
    );
  };

const messageList = (messageState: AppState['messages'], buddyId: string) => {
  const messagesById = RD.remoteData.map(messageState.messages, r =>
    record.lookup(buddyId, r),
  );

  return getFoldableComposition(RD.remoteData, O.option).reduce<
    string,
    Record<string, messageApi.Message>,
    messageApi.Message[]
  >(messagesById, [], (_, messages) =>
    Object.values(messages).sort(({ sentTime: A }, { sentTime: B }) => A - B),
  );
};

export type Buddy = buddyApi.Buddy & { hasNewMessages: boolean };

export function getChatList(
  buddies: AppState['buddies']['buddies'],
  messageState: AppState['messages'],
): RD.RemoteData<string, Buddy[]> {
  return pipe(
    buddies,
    RD.map(
      record.mapWithIndex((buddyId, buddy) => ({
        ...buddy,
        hasNewMessages: pipe(
          messageList(messageState, buddyId),
          array.filter(message => message.type === 'Received'),
          array.foldMap(monoidAny)(({ isSeen }) => !isSeen),
        ),
      })),
    ),
    RD.map(Object.values),
  );
}
