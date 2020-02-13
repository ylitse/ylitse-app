import * as t from 'io-ts';

import * as http from '../lib/http';
import * as r from '../lib/result';

import * as config from './config';

type ApiLoginToken = t.TypeOf<typeof tokenType>;
const tokenType = t.strict({
  scopes: t.strict({
    account_id: t.string,
    user_id: t.string,
  }),
  tokens: t.strict({
    access_token: t.string,
    refresh_token: t.string,
  }),
});

const newAccessTokenType = t.strict({
  access_token: t.string,
});

export type AccessToken = {
  accountId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  fetchTime: number;
};

function toAccessToken({
  scopes: { account_id, user_id },
  tokens,
}: ApiLoginToken): AccessToken {
  return {
    accountId: account_id,
    userId: user_id,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    fetchTime: Date.now(),
  };
}

export type Credentials = {
  userName: string;
  password: string;
};

const loginUrl = config.baseUrl + 'login';
export async function login({
  userName,
  password,
}: Credentials): http.Future<AccessToken> {
  const input = {
    login_name: userName,
    password,
  };
  const apiToken = await http.post(loginUrl, input, tokenType);
  return r.map(apiToken, toAccessToken);
}

export async function refreshAccessToken(
  accessToken: AccessToken,
): http.Future<AccessToken> {
  const apiToken = await http.post(
    `${config.baseUrl}refresh`,
    { refresh_token: accessToken.refreshToken },
    newAccessTokenType,
  );
  return r.map(apiToken, token => ({
    ...accessToken,
    fetchTime: Date.now(),
    accessToken: token.access_token,
  }));
}

export function authHeader({
  accessToken,
}: AccessToken): RequestInit['headers'] {
  return { Authorization: `Bearer ${accessToken}` };
}
