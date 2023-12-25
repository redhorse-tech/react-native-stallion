import { StyleSheet } from 'react-native';

import { COLORS } from '../../../constants/colors';
import { STD_MARGIN } from '../../../constants/appConstants';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.background_grey,
  },
  mainListContainer: {
    flexGrow: 1,
  },
  initalLoaderContainer: {
    width: '100%',
    paddingTop: STD_MARGIN * 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
