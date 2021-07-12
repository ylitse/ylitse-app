import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  waitAndTypeText,
  signIn,
  forceLogout,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('changeEmail', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    const newEmail = 'other@email.com';
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();
    await element(by.id('main.settings.account.email.change')).tap();

    await element(by.id('main.settings.account.email.input')).clearText();
    await waitAndTypeText('main.settings.account.email.input', newEmail + '\n');
    await expect(element(by.text('Invalid email address'))).toBeNotVisible();
    await element(by.id('main.settings.account.email.save')).tap();
    await element(by.id('main.settings.account.email.cancel')).tap();
    await expect(element(by.text(newEmail))).toBeVisible();
  });

  it('for a mentee with invalid email', async () => {
    await forceLogout();
    const mentee = accountFixtures.mentees[0];
    const newEmail = 'other';
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();
    await element(by.id('main.settings.account.email.change')).tap();

    await element(by.id('main.settings.account.email.input')).clearText();
    await waitAndTypeText('main.settings.account.email.input', newEmail + '\n');
    await expect(element(by.text('Invalid email address'))).toBeVisible();

    await element(by.id('main.settings.account.email.save')).tap();
    await element(by.id('main.settings.account.email.cancel')).tap();
    await expect(element(by.text(mentee.email))).toBeVisible();
  });
});
