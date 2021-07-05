import React from 'react';
import RN from 'react-native';

import Button from './Button';
import colors from './colors';
import fonts from './fonts';
import NamedInputField from './NamedInputField';
import { textShadow } from './shadow';

import { validateEmail } from '../../lib/validators';
import Message from "../components/Message"
type Props = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onGoBack: () => void;
  onButtonPress: () => void;
};

export default (props: Props) => {
  const isValidEmail = props.email === '' ? true : validateEmail(props.email);


  return (
    <>
      <NamedInputField
        style={styles.field}
        name="main.settings.account.email.title"
        value={props.email}
        onChangeText={props.setEmail}
        testID="main.settings.account.email.input"
      />
      {isValidEmail ? null : (<Message style={styles.text}
        id="main.settings.account.email.invalid" />)}

      <RN.View style={styles.buttonContainer}>
        <Button
          style={styles.cancelButton}
          messageStyle={styles.cancelButtonText}
          onPress={props.onGoBack}
          messageId="meta.cancel"
          testID="main.settings.account.email.cancel"
        />
        <Button
          style={styles.changePasswordButton}
          messageStyle={styles.buttonText}
          onPress={props.onButtonPress}
          messageId="meta.save"
          testID="main.settings.account.email.save"
          disabled={!isValidEmail}
        />
      </RN.View>
    </>
  );
};

const styles = RN.StyleSheet.create({
  text: {
    color: colors.red,
    textAlign: "center",
  },
  field: {
    marginVertical: 8,
  },
  cancelButtonText: {
    ...fonts.large,
    color: colors.darkestBlue,
  },
  changePasswordButton: {
    backgroundColor: colors.blue,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginVertical: 24,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
  cancelButton: { backgroundColor: colors.gray, marginBottom: 16 },
});
