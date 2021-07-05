import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';

import * as navigationProps from '../../../lib/navigation-props';
import useLayout from '../../../lib/use-layout';

import Title from './Title';
import Input from './Input';
import MessageList from './MessageList';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { Dialog, DialogProps } from '../../components/Dialog';

import colors from '../../components/colors';
import { BanActions } from 'src/api/buddies';

export type ChatRoute = {
  'Main/Chat': { buddyId: string };
};

type Props = navigationProps.NavigationProps<ChatRoute, ChatRoute>;

const Chat = ({ navigation }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };

  type DialogState = { dialogOpen: boolean; dropdownOpen: boolean };

  const [dialogState, setDialogState] = React.useState<DialogState>({
    dialogOpen: false,
    dropdownOpen: false,
  });

  const [deleteOption, setDeleteOption] = React.useState(false);

  const [{ height }, onLayout] = useLayout();

  const keyboardViewBehaviour =
    RN.Platform.OS === 'ios' ? 'padding' : undefined;

  const buddyId = navigation.getParam('buddyId');

  const isBanned = ReactRedux.useSelector(selectors.getIsBanned(buddyId));

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const setBanStatus = (banStatus: BanActions) => {
    dispatch({
      type: 'buddies/changeBanStatus/start',
      payload: { buddyId, banStatus },
    });
  };

  const handleBan = (banStatus: BanActions) => {
    setDialogState({ dropdownOpen: false, dialogOpen: false });
    goBack();
    setBanStatus(banStatus);
  };

  const dialogProperties: Omit<DialogProps, 'onPressCancel' | 'buttonId'> =
    isBanned
      ? deleteOption
        ? {
            textId: 'main.chat.delete.confirmation',
            onPress: () => handleBan('Delete'),
            type: 'warning',
          }
        : {
            textId: 'main.chat.unban.confirmation',
            onPress: () => handleBan('Unban'),
          }
      : {
          textId: 'main.chat.ban.confirmation',
          onPress: () => handleBan('Ban'),
          type: 'warning',
        };

  const dropdownItems: DropDownItem[] = isBanned
    ? [
        {
          textId: 'main.chat.unban',
          onPress: () => {
            setDeleteOption(false);
            setDialogs('dialogOpen', true);
          },
        },
        {
          textId: 'main.chat.delete',
          onPress: () => {
            setDeleteOption(true);
            setDialogs('dialogOpen', true);
          },
        },
      ]
    : [
        {
          textId: 'main.chat.ban',
          onPress: () => {
            setDeleteOption(false);
            setDialogs('dialogOpen', true);
          },
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
        style={styles.title}
        onPress={goBack}
        buddyId={buddyId}
        onLayout={onLayout}
        openDropdown={() => setDialogs('dropdownOpen', true)}
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
      <RN.KeyboardAvoidingView
        style={styles.container}
        behavior={keyboardViewBehaviour}
      >
        <MessageList buddyId={buddyId} />
        <Input style={styles.input} buddyId={buddyId} />
      </RN.KeyboardAvoidingView>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 8,
    backgroundColor: colors.lightestGray,
  },
  dropdown: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
  title: {},
  input: {
    marginTop: 8,
  },
});

export default Chat;
