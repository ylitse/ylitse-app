import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as ReactRedux from 'react-redux';
import * as state from '../../../state';
import * as selectors from '../../../state/selectors';

import colors from '../../components/colors';
import { cardBorderRadius } from '../../components/Card';
import fonts from '../../components/fonts';
import getBuddyColor from '../../components/getBuddyColor';

type StateProps = {
  name: string;
};

type DispatchProps = {};

type OwnProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  onPress: () => void | undefined;
  buddyId: string;
  onLayout: (e: RN.LayoutChangeEvent) => void | undefined;
  openDropdown: () => void | undefined;
};

type Props = OwnProps & DispatchProps & StateProps;

const Title: React.FC<Props> = ({
  style,
  onPress,
  name,
  buddyId,
  onLayout,
  openDropdown,
}) => {
  const color = getBuddyColor(buddyId);

  return (
    <RN.View
      onLayout={onLayout}
      style={[styles.blob, { backgroundColor: color }, style]}
    >
      <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
        {!onPress ? null : (
          <RN.TouchableOpacity style={styles.chevronButton} onPress={onPress}>
            <RN.Image
              source={require('../../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={require('../../images/user.svg')}
          style={styles.userIcon}
        />
        <RN.Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
          {name}
        </RN.Text>
        <RN.TouchableHighlight
          style={styles.kebabIconHighlight}
          onPress={openDropdown}
          underlayColor={colors.faintBackground}
          testID={'main.chat.title.kebabicon'}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <RN.Image
            source={require('../../images/three-dot-menu-chat.svg')}
            style={styles.kebabIcon}
          />
        </RN.TouchableHighlight>
      </SafeAreaView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  blob: {
    borderBottomRightRadius: cardBorderRadius,
    borderBottomLeftRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  chevronButton: {
    marginRight: 16,
    marginLeft: 0,
  },
  chevronIcon: {
    tintColor: colors.black,
    width: 32,
    height: 32,
  },
  userIcon: {
    tintColor: colors.black,
    width: 32,
    height: 32,
    marginRight: 8,
  },
  name: {
    ...fonts.regularBold,
    flex: 1,
    flexWrap: 'wrap',
  },
  kebabIconHighlight: {
    padding: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kebabIcon: {
    tintColor: colors.black,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(({ mentors, buddies }, { buddyId }) => {
  return {
    name: selectors.getBuddyName(buddyId, buddies.buddies, mentors),
  };
})(Title);
