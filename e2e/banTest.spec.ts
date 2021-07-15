import { by, element, expect, device, waitFor } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIDeleteAccounts,
  signIn,
  waitAndTypeText,
  forceLogout,
  APIBan,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Filter chats', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('can ban a contact', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    // mentee sends a msg to mentor
    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    // mentor side
    await signIn(mentor);

    // not banned yet, should show new message indicator
    await expect(element(by.id('main.tabs.unseenDot'))).toBeVisible();
    await element(by.id('tabs.chats')).tap();
    await expect(
      element(by.id('main.buddyList.button.unseenDot')),
    ).toBeVisible();

    // mentor bans the mentee
    await element(by.text(mentee.displayName)).atIndex(0).tap();
    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Ban chat')).tap();
    await element(by.text('OK')).tap();

    await expect(element(by.text(mentee.displayName))).toBeNotVisible();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await expect(element(by.text(mentee.displayName))).toBeVisible();

    await forceLogout();

    // mentee sends another msg to mentor
    await signIn(mentee);
    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();
    await waitAndTypeText('main.chat.input.input', 'Notice me Senpai!');
    await element(by.id('main.chat.input.button')).tap();
    await forceLogout();

    // mentor should not see new message indicator
    await signIn(mentor);
    await expect(element(by.id('main.tabs.unseenDot'))).toBeNotVisible();
    await element(by.id('tabs.chats')).tap();
    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();
    await expect(
      element(by.id('main.buddyList.button.unseenDot')),
    ).toBeNotVisible();

    // but new msg should still be there
    await element(by.text(mentee.displayName)).atIndex(0).tap();
    await expect(element(by.text('Notice me Senpai!'))).toBeVisible();
    await forceLogout();
  });

  it('can restore banned contact', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await APIBan(mentor, mentee);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await element(by.text(mentee.displayName)).tap();

    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Restore chat')).tap();

    await element(by.text('OK')).tap();

    await waitFor(element(by.id('main.bannedlist.back.button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('main.bannedlist.back.button')).tap();

    await expect(element(by.text(mentee.displayName))).toBeVisible();

    await forceLogout();
  });

  it('can delete banned contact', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await APIBan(mentor, mentee);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await element(by.text(mentee.displayName)).tap();

    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Delete chat')).tap();

    await element(by.text('OK')).tap();

    // mentor should not see mentee's name in banned list
    await expect(element(by.text(mentee.displayName))).toBeNotVisible();

    await waitFor(element(by.id('main.bannedlist.back.button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('main.bannedlist.back.button')).tap();

    // mentor should not see mentee's name in chats list
    await expect(element(by.text(mentee.displayName))).toBeNotVisible();

    await forceLogout();

    // mentee can send another msg to mentor
    await signIn(mentee);
    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();
    await waitAndTypeText('main.chat.input.input', 'Notice me Senpai!');
    await element(by.id('main.chat.input.button')).tap();
    await forceLogout();

    // mentor should not see new message indicator
    await signIn(mentor);
    await expect(element(by.id('main.tabs.unseenDot'))).toBeNotVisible();
    await element(by.id('tabs.chats')).tap();
    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();
    await expect(
      element(by.id('main.buddyList.button.unseenDot')),
    ).toBeNotVisible();

    // mentor should not see mentee's name in chats list
    await expect(element(by.text(mentee.displayName))).toBeNotVisible();

    await forceLogout();
  });

  it('can delete all banned contacts', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentee1 = accountFixtures.mentees[1];
    await APISignUpMentee(mentee1);

    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await signIn(mentee1);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi!');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await APIBan(mentor, mentee);
    await APIBan(mentor, mentee1);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await element(by.id('main.bannedlist.kebabicon')).tap();
    await element(by.text('Delete all')).tap();

    await element(by.text('OK')).tap();

    // mentor should not see mentees' names in banned list
    await expect(element(by.text(mentee.displayName))).toBeNotVisible();
    await expect(element(by.text(mentee1.displayName))).toBeNotVisible();

    await waitFor(element(by.id('main.bannedlist.back.button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('main.bannedlist.back.button')).tap();

    // mentor should not see mentees' names in chats list
    await expect(element(by.text(mentee.displayName))).toBeNotVisible();
    await expect(element(by.text(mentee1.displayName))).toBeNotVisible();

    await forceLogout();
  });
});
