import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APIDeleteAccounts,
  scrollDownAndTap,
  waitAndTypeText,
  forceLogout,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('SignUp', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.up', 'onboarding.mentorlist.view');

    await waitAndTypeText(
      'onboarding.signUp.userName',
      `${mentee.loginName}\n`,
    );
    await waitAndTypeText('onboarding.signUp.password', `${mentee.password}\n`);
    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
    );

    await element(by.id('onboarding.displayName.inputTitle')).clearText();
    await waitAndTypeText(
      'onboarding.displayName.inputTitle',
      `${mentee.displayName}\n`,
    );
    await scrollDownAndTap(
      'onboarding.displayName.nextButton',
      'onboarding.displayName.view',
    );

    await waitAndTypeText('onboarding.email.inputTitle', `${mentee.email}\n`);
    await scrollDownAndTap(
      'onboarding.email.nextButton',
      'onboarding.email.view',
    );

    await scrollDownAndTap(
      'onboarding.privacyPolicy.agreeButton',
      'onboarding.privacyPolicy.view',
    );

    await scrollDownAndTap(
      'onboarding.privacyPolicy.nextButton',
      'onboarding.privacyPolicy.view',
    );

    await element(by.id('tabs.settings')).tap();
    await expect(element(by.id('main.settings.account.userName'))).toHaveText(
      mentee.loginName,
    );
    await expect(
      element(by.id('main.settings.account.displayName')),
    ).toHaveText(mentee.displayName);
    await expect(element(by.id('main.settings.account.email'))).toHaveText(
      mentee.email,
    );
    await forceLogout();
  });

  it('cannot go past displayname if display_name is erased', async () => {
    const mentee = accountFixtures.mentees[0];
    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.up', 'onboarding.mentorlist.view');

    await waitAndTypeText(
      'onboarding.signUp.userName',
      `${mentee.loginName}\n`,
    );
    await waitAndTypeText('onboarding.signUp.password', `${mentee.password}\n`);
    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
    );

    await element(by.id('onboarding.displayName.inputTitle')).clearText();
    await waitAndTypeText('onboarding.displayName.inputTitle', ``);
    await scrollDownAndTap(
      'onboarding.displayName.nextButton',
      'onboarding.displayName.view',
    );
    await expect(
      element(by.id('onboarding.displayName.inputTitle')),
    ).toBeVisible();
    await forceLogout();
  });
});
