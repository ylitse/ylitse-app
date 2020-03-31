import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import * as navigationProps from '../../lib/navigation-props';
import { useDispatch, useSelector } from 'react-redux';

import * as storage from '../../state/reducers/storage';
import * as token from '../../state/reducers/accessToken';
import * as actions from '../../state/actions';

import { MentorListRoute } from '../Onboarding/MentorList';
import { TabsRoute } from '../Main/Tabs';

export type SplashRoute = {
  Splash: {};
};

type Props = navigationProps.NavigationProps<
  SplashRoute,
  MentorListRoute & TabsRoute
>;

const Splash = ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  React.useEffect(() => {
    dispatch(storage.readToken);
  }, []);

  const readTokenState = useSelector(storage.getReadToken);

  React.useEffect(() => {
    if (RD.isFailure(readTokenState)) {
      navigation.replace('Onboarding/MentorList', {});
    }
  }, [readTokenState]);

  React.useEffect(() => {
    if (RD.isFailure(readTokenState)) {
      navigation.replace('Onboarding/MentorList', {});
    }
  });

  const tokenState = useSelector(token.getToken);
  React.useEffect(() => {
    if (O.isSome(tokenState)) {
      navigation.replace('Main/Tabs', {});
    }
  });

  return <RN.View />;
};

export default Splash;
