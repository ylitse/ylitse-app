import { right, left, isRight, isLeft } from 'fp-ts/lib/Either';

import * as validators from '../validators';

import { describe, expect, it } from '@jest/globals';

describe('unixTimeFromDateString', () => {
  it('decodes js date iso string', () => {
    const s = '2020-01-16T10:29:32.350430+00:00';
    expect(validators.unixTimeFromDateString.decode(s)).toEqual(
      right(new Date(s).getTime()),
    );
  });
  it('fails to decode random string', () => {
    expect(validators.unixTimeFromDateString.decode('foo')).toEqual(
      left(expect.any(Array)),
    );
  });
});

describe('validateEmail', () => {
  [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    'あいうえお@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@111.222.333.44444',
    'a',
    `${'x'.repeat(400)}@example.org`,
  ].forEach(invalidEmail => {
    it(`fails to decode invalid address ${invalidEmail}`, () => {
      expect(isLeft(validators.ValidEmail.decode(invalidEmail))).toEqual(true);
    });
  });

  [
    '',
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com',
    "!#$%&'*+-/=?^_`.{|}~@kebab.fi",
    `${'x'.repeat(63)}@${'e'.repeat(191)}.${'f'.repeat(62)}`,
  ].forEach(validEmail => {
    it(`decodes valid email address ${validEmail}`, () => {
      expect(isRight(validators.ValidEmail.decode(validEmail))).toEqual(true);
    });
  });
});
