import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import { withStallion, useStallionModal } from 'react-native-stallion';

const App: React.FC = () => {
  const { showModal } = useStallionModal();
  return (
    <View style={styles.container}>
      <Button title="OpenModal" onPress={showModal} />
    </View>
  );
};

export default withStallion(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
