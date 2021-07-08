import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as actions from '../../../state/actions';
import * as RD from '@devexperts/remote-data-ts';

import * as navigationProps from '../../../lib/navigation-props';
import useLayout from '../../../lib/use-layout';

import * as buddyState from '../../../state/reducers/buddies';

import Button from '../BuddyList/Button';
import { ChatRoute } from '../Chat';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { Dialog, DialogProps } from '../../components/Dialog';
import { Title } from './Title';

import colors from '../../components/colors';
import RemoteData from '../../components/RemoteData';

export type BannedListRoute = {
  'Main/BannedList': {};
};

type Props = navigationProps.NavigationProps<BannedListRoute, ChatRoute>;

export default ({ navigation }: Props) => {
  const remoteBuddies = ReactRedux.useSelector(buddyState.getBannedBuddies);

  type DialogState = { dialogOpen: boolean; dropdownOpen: boolean };

  const [dialogState, setDialogState] = React.useState<DialogState>({
    dropdownOpen: false,
    dialogOpen: false,
  });

  const [{ height }, onLayout] = useLayout();

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const handleDeleteAll = () => {
    if (RD.isSuccess(remoteBuddies)) {
      setDialogState({ dropdownOpen: false, dialogOpen: false });
      const buddyIds = remoteBuddies.value.map(buddy => buddy.buddyId);
      dispatch({
        type: 'buddies/delete/start',
        payload: { buddyIds },
      });
    }
  };

  const dialogProperties: Omit<DialogProps, 'onPressCancel' | 'buttonId'> = {
    textId: 'main.chat.deleteAll.confirmation',
    onPress: () => handleDeleteAll(),
    type: 'warning',
  };

  const dropdownItems: DropDownItem[] = [
    {
      textId: 'main.chat.deleteAll',
      onPress: () => setDialogs('dialogOpen', true),
    },
  ];

  const setDialogs = (key: keyof DialogState, show: boolean) => {
    setDialogState({ ...dialogState, [key]: show });
  };

  return (
    <RN.TouchableOpacity
      style={styles.screen}
      activeOpacity={1}
      onPress={() => setDialogs('dropdownOpen', false)}
      disabled={!dialogState.dropdownOpen}
    >
      <Title
        openDropdown={() => setDialogs('dropdownOpen', true)}
        onLayout={onLayout}
        onPressBack={onPressBack}
      />
      {dialogState.dropdownOpen && (
        <DropDown
          style={[styles.dropdown, { top: height - 8 }]}
          items={dropdownItems}
          testID={'main.chat.menu'}
          tintColor={colors.black}
        />
      )}
      {dialogState.dialogOpen && (
        <Dialog
          {...dialogProperties}
          buttonId={'meta.ok'}
          onPressCancel={() => setDialogs('dialogOpen', false)}
        />
      )}
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
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  button: { marginVertical: 16 },
});
