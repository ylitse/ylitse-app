import React from 'react';
import { createAppContainer } from 'react-navigation';
import * as reactNavigationStack from 'react-navigation-stack';

import Splash, { SplashRoute } from './Splash';
import Welcome, { WelcomeRoute } from './Onboarding/Welcome';
import MentorList, { MentorListRoute } from './Onboarding/MentorList';
import Sign, { SignRoute } from './Onboarding/Sign';
import SignUp, { SignUpRoute } from './Onboarding/SignUp';
import DisplayName, { DisplayNameRoute } from './Onboarding/DisplayName';
import Email, { EmailRoute } from './Onboarding/Email';
import PrivacyPolicy, { PrivacyPolicyRoute } from './Onboarding/PrivacyPolicy';
import SearchMentor, { SearchMentorRoute } from './Main/SearchMentor';

import SignIn, { SignInRoute } from './Onboarding/SignIn';
import Tabs, { TabsRoute } from './Main/Tabs';
import MentorCardExpanded, {
  MentorCardExpandedRoute,
} from './Main/MentorCardExpanded';

import Chat, { ChatRoute } from './Main/Chat';
import BannedList, { BannedListRoute } from './Main/BannedList';
import Logout, { LogoutRoute } from './Main/Settings/Logout';
import DeleteAccount, {
  DeleteAccountRoute,
} from './Main/Settings/DeleteAccount';
import PasswordChange, { PasswordChangeRoute } from './Main/Settings/Password';
import EmailChange, { EmailChangeRoute } from './Main/Settings/Email';

type RouteName = keyof (SplashRoute &
  WelcomeRoute &
  MentorListRoute &
  SignUpRoute &
  SignRoute &
  DisplayNameRoute &
  EmailRoute &
  PrivacyPolicyRoute &
  SignInRoute &
  TabsRoute &
  MentorCardExpandedRoute &
  ChatRoute &
  BannedListRoute &
  LogoutRoute &
  DeleteAccountRoute &
  PasswordChangeRoute &
  EmailChangeRoute &
  SearchMentorRoute);
type Screen =
  | typeof Splash
  | typeof Welcome
  | typeof MentorList
  | typeof Sign
  | typeof SignUp
  | typeof DisplayName
  | typeof Email
  | typeof PrivacyPolicy
  | typeof SignIn
  | typeof Tabs
  | typeof MentorCardExpanded
  | typeof Chat
  | typeof BannedList
  | typeof Logout
  | typeof DeleteAccount
  | typeof PasswordChange
  | typeof EmailChange
  | typeof SearchMentor;

export type Route = keyof typeof routes;

const routes: {
  [name in RouteName]: { screen: Screen };
} = {
  Splash: {
    screen: Splash,
  },
  'Onboarding/Welcome': {
    screen: Welcome,
  },
  'Onboarding/MentorList': {
    screen: MentorList,
  },
  'Onboarding/Sign': {
    screen: Sign,
  },
  'Onboarding/SignUp': {
    screen: SignUp,
  },
  'Onboarding/SignIn': {
    screen: SignIn,
  },
  'Onboarding/DisplayName': {
    screen: DisplayName,
  },
  'Onboarding/Email': {
    screen: Email,
  },
  'Onboarding/PrivacyPolicy': {
    screen: PrivacyPolicy,
  },
  'Main/Tabs': {
    screen: Tabs,
  },
  'Main/MentorCardExpanded': {
    screen: MentorCardExpanded,
  },
  'Main/Chat': {
    screen: Chat,
  },
  'Main/BannedList': {
    screen: BannedList,
  },
  'Main/Settings/Logout': {
    screen: Logout,
  },
  'Main/Settings/DeleteAccount': {
    screen: DeleteAccount,
  },
  'Main/Settings/PasswordChange': {
    screen: PasswordChange,
  },
  'Main/Settings/EmailChange': {
    screen: EmailChange,
  },
  'Main/SearchMentor': {
    screen: SearchMentor,
  },
};

const initialRouteName: RouteName = 'Splash';

const config = {
  initialRouteName,
  headerMode: 'none' as const,
};

const StackNavigator = reactNavigationStack.createStackNavigator(
  routes,
  config,
);
const AppContainer = createAppContainer(StackNavigator);

export default () => <AppContainer />;
