import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import colors from './colors';
import fonts from './fonts';
import Message from './Message';
import shadow from './shadow';

export type DropDownItem = {
  textId: localization.MessageId;
  onPress: () => void;
};

type Props = {
  items: DropDownItem[];
  testID?: string;
  tintColor?: string;
  style: any;
};

const DropDown: React.FC<Props> = ({ items, style }) => {
  return (
    <RN.View style={[styles.dropdown, style]}>
      {items.map((item, index) => (
        <RN.TouchableOpacity
          key={index}
          style={styles.button}
          onPress={item.onPress}
        >
          <Message id={item.textId} style={styles.text} />
        </RN.TouchableOpacity>
      ))}
    </RN.View>
  );
};

export default DropDown;

const styles = RN.StyleSheet.create({
  dropdown: {
    ...shadow(7),
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: colors.lightestGray,
  },
  button: {
    padding: 16,
    backgroundColor: colors.lightestGray,
    paddingHorizontal: 32,
  },
  text: {
    ...fonts.largeBold,
  },
});
