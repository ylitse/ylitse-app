import React from 'react';
import RN from 'react-native';

import * as localization from '../../../../localization';

import Message from '../../../components/Message';
import Button from '../../../components/Button';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import { textShadow } from '../../../components/shadow';

type Props = {
  imageSource: RN.ImageSourcePropType;
  style?: RN.StyleProp<RN.ViewStyle>;
  imageStyle?: RN.StyleProp<RN.ImageStyle>;
  messageId: localization.MessageId;
  onPress: () => void;
};

export default (props: Props) => {
  return (
    <RN.View style={[styles.container, props.style]}>
      <RN.Image
        style={[styles.image, props.imageStyle]}
        source={props.imageSource}
      />
      <Message id={props.messageId} style={styles.text} />
      <Button
        onPress={props.onPress}
        messageStyle={styles.retryButtonText}
        messageId="components.remoteData.retry"
        style={{ backgroundColor: colors.blue }}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 24,
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.largeBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  image: {
    width: 160,
    height: 160,
    tintColor: colors.darkestBlue,
    marginBottom: 40,
  },
  retryButtonText: {
    color: colors.white,
    ...fonts.largeBold,
    ...textShadow,
  },
});
