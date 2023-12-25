import React, { memo } from 'react';
import {
  TextInput,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';

import ButtonFullWidth from '../../../../components/common/ButtonFullWidth';
import {
  LOGIN_PAGE_KEYS,
  SUBMIT_BUTTON_TEXT,
} from '../../../../constants/appConstants';
import { COLORS } from '../../../../constants/colors';

import styles from './styles';

interface IEmail {
  email?: string;
  password?: string;
  isEditable?: boolean;
  handleEmailChange: (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => void;
  handlePasswordChange: (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => void;
  handleSubmitClick: () => void;
}

const Email: React.FC<IEmail> = ({
  email,
  password,
  isEditable,
  handleEmailChange,
  handlePasswordChange,
  handleSubmitClick,
}) => {
  return (
    <>
      <TextInput
        style={styles.textInp}
        placeholder={LOGIN_PAGE_KEYS.email}
        placeholderTextColor={COLORS.black5}
        editable={isEditable}
        value={email}
        onChange={handleEmailChange}
        autoCapitalize="none"
      />
      <TextInput
        secureTextEntry={true}
        style={styles.textInp}
        placeholder={LOGIN_PAGE_KEYS.password}
        placeholderTextColor={COLORS.black5}
        editable={isEditable}
        value={password}
        onChange={handlePasswordChange}
      />
      <View style={styles.buttonContainer}>
        <ButtonFullWidth
          onPress={handleSubmitClick}
          buttonText={SUBMIT_BUTTON_TEXT}
          enabled={isEditable && (email && password ? true : false)}
        />
      </View>
    </>
  );
};

export default memo(Email);
