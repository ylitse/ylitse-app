/* global RequestInit, Response */
import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

const unauthorizedRequest = 'Request Unauthorized';
export const isUnauthorized = (u: unknown) => u === unauthorizedRequest;

export const request = (url: string, options: RequestInit) =>
  pipe(
    TE.tryCatch(
      () => fetch(url, options),
      () => 'Connection failure.',
    ),
    TE.chain(response =>
      response.ok
        ? TE.right(response)
        : TE.left(response.status === 401 ? unauthorizedRequest : 'Bad status'),
    ),
  );

export const get = (url: string, options?: RequestInit) =>
  request(url, { ...(options || {}), method: 'GET' });
export const head = (url: string, options?: RequestInit) =>
  request(url, {
    method: 'HEAD',
    ...(options || {}),
  });
export const post = (url: string, body: any, options?: RequestInit) =>
  request(url, {
    body: JSON.stringify(body),
    method: 'POST',
    ...(options || {}),
  });
export const put = (url: string, body: any, options?: RequestInit) =>
  request(url, {
    body: JSON.stringify(body),
    method: 'PUT',
    ...(options || {}),
  });
export const patch = (url: string, body: any, options?: RequestInit) =>
  request(url, {
    body: JSON.stringify(body),
    method: 'PATCH',
    ...(options || {}),
  });

const getJson = (response: Response) =>
  pipe(
    TE.tryCatch(
      () => response.json(),
      () => 'Failed to get json.',
    ),
  );

const decode =
  <A, B>(model: t.Type<A, B, unknown>) =>
  (u: unknown) =>
    pipe(
      u,
      model.decode,
      E.mapLeft(() => 'Failed to decode JSON.'),
      TE.fromEither,
    );

export const validateResponse = <A, B, C>(
  task: TE.TaskEither<string, Response>,
  model: t.Type<A, B, unknown>,
  fromModel: (a: A) => C,
) => pipe(task, TE.chain(getJson), TE.chain(decode(model)), TE.map(fromModel));
