import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import * as navigationProps from '../../../lib/navigation-props';

import * as buddyState from '../../../state/reducers/buddies';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';
import RemoteData from '../../components/RemoteData';
import TitledContainer from '../../components/TitledContainer';

import Button from './Button';

import { ChatRoute } from '../Chat';

export type BannedListRoute = {
  'Main/BuddyList/BannedList': {};
};

type Props = navigationProps.NavigationProps<BannedListRoute, ChatRoute>;

export default ({ navigation }: Props) => {
  const remoteBuddies = useSelector(buddyState.getBannedBuddies);

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <TitledContainer
      TitleComponent={
        <RN.View style={styles.titleContainer}>
          <RN.TouchableOpacity
            onPress={onPressBack}
            testID={'main.bannedlist.back.button'}
          >
            <RN.Image
              source={require('../../images/chevron-left.svg')}
              style={styles.backButtonIcon}
            />
          </RN.TouchableOpacity>
          <Message id="main.chat.navigation.banned" style={styles.header} />
          <RN.View style={styles.titleBalancer} />
        </RN.View>
      }
      color={colors.blue}
    >
      <RemoteData data={remoteBuddies}>
        {buddies => (
          <RN.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            testID={'main.buddyList.view'}
          >
            {buddies.map(buddy => (
              <Button
                key={buddy.buddyId + '1'}
                style={styles.button}
                onPress={onPress}
                name={buddy.name}
                buddyId={buddy.buddyId}
              />
            ))}
          </RN.ScrollView>
        )}
      </RemoteData>
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
    flex: 6,
  },
  titleBalancer: {
    flex: 1,
  },
  scrollView: {
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  button: { marginVertical: 16 },
  backButtonIcon: {
    tintColor: colors.white,
    width: 48,
    height: 48,
  },
});
