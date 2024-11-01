import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import {
  BACK_BUTTON_TEXT,
  LOGOUT_BUTTON_TEXT,
} from '../../../constants/appConstants';
import ButtonFullWidth from '../ButtonFullWidth';
import SharedDataManager from '../../../utils/SharedDataManager';

interface IProfileOverlay {
  fullName?: string;
  email?: string;
  onBackPress: () => void;
  onLogoutPress: () => void;
}

const ProfileOverlay: React.FC<IProfileOverlay> = ({
  fullName,
  email,
  onBackPress,
  onLogoutPress,
}) => {
  const uid = useMemo(() => {
    return SharedDataManager.getInstance()?.getUid() || '';
  }, []);
  return (
    <View style={styles.profileContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.profileTitle}>{fullName?.slice(0, 1)}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.profileInfoText}>{fullName}</Text>
          <Text style={styles.profileSubInfoText}>{email}</Text>
          <Text style={[styles.uidTitle, styles.bold]}>UID:</Text>
          <Text style={styles.uidText}>{uid}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonFullWidth
          onPress={onLogoutPress}
          buttonText={LOGOUT_BUTTON_TEXT}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonFullWidth
          primary={false}
          onPress={onBackPress}
          buttonText={BACK_BUTTON_TEXT}
        />
      </View>
    </View>
  );
};

export default memo(ProfileOverlay);
