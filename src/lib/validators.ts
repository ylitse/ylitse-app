import * as t from 'io-ts';
import { either } from 'fp-ts/lib/Either';

// represents a unix time from an ISO string
export const unixTimeFromDateString = new t.Type<number, string, unknown>(
  'UnixTimeFromDateString',
  (u): u is number => typeof u === 'number',
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      const n = new Date(s).getTime();

      return isNaN(n) ? t.failure(u, c) : t.success(n);
    }),
  a => new Date(a).toISOString(),
);

export const validateEmail = (value: string) => {
  if (value.length > 320) {
    return false;
  }

  return /^[a-zA-Z0-9!#$%&'*+\-/=?^_`.{|}~]{1,64}@[a-z0-9.-]+\.[a-z]{2,64}$/.test(
    value,
  );
};
