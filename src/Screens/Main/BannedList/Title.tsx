import React from 'react';
import RN from 'react-native';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';

export type BannedListRoute = {
  'Main/BannedList': {};
};

type Props = {
  openDropdown: () => void | undefined;
  onLayout: (e: RN.LayoutChangeEvent) => void | undefined;
  onPressBack: () => void | undefined;
};

export const Title: React.FC<Props> = ({
  openDropdown,
  onLayout,
  onPressBack,
}) => {
  return (
    <RN.SafeAreaView style={[styles.shadow]} onLayout={onLayout}>
      <RN.TouchableOpacity
        onPress={onPressBack}
        testID={'main.bannedlist.back.button'}
      >
        <RN.Image
          source={require('../../images/chevron-left.svg')}
          style={styles.backButtonIcon}
        />
      </RN.TouchableOpacity>
      <Message
        id="main.chat.navigation.banned"
        style={styles.screenTitleText}
      />
      <RN.TouchableHighlight
        style={styles.kebabIconHighlight}
        underlayColor={colors.faintBackground}
        testID={'main.bannedlist.kebabicon'}
        onPress={openDropdown}
      >
        <RN.Image
          source={require('../../images/three-dot-menu.svg')}
          style={styles.kebabIcon}
        />
      </RN.TouchableHighlight>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  shadow: {
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
  },
  backButtonIcon: {
    tintColor: colors.white,
    width: 48,
    height: 48,
  },
  kebabIconHighlight: {
    height: 32,
    width: 32,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kebabIcon: {
    tintColor: colors.white,
  },
});
