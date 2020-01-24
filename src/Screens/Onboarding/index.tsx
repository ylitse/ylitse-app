import * as reactNavigationStack from 'react-navigation-stack';

import MentorList, { MentorListRoute } from './MentorList';
import SignUp, { SignUpRoute } from './SignUp';
import SignIn, { SignInRoute } from './SignIn';
import Main, { MainRoute } from './Main';

type RouteName = keyof (MentorListRoute &
  SignUpRoute &
  SignInRoute &
  MainRoute);
type Screen = typeof MentorList | typeof SignUp | typeof SignIn | typeof Main;

export type Route = keyof typeof routes;
const routes: {
  [name in RouteName]: { screen: Screen };
} = {
  'Onboarding/MentorList': {
    screen: MentorList,
  },
  'Onboarding/SignUp': {
    screen: SignUp,
  },
  'Onboarding/SignIn': {
    screen: SignIn,
  },
  Main: {
    screen: Main,
  },
};

const initialRouteName: RouteName = 'Onboarding/SignIn';
const config = {
  initialRouteName,
  headerMode: 'none' as const,
};

export default reactNavigationStack.createStackNavigator(routes, config);
