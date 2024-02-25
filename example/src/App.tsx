import * as React from 'react';

import { StyleSheet, View, Button, Text } from 'react-native';
import {
  withStallion,
  useStallionModal,
  Initialize,
} from 'react-native-stallion';

Initialize({
  projectId: '6500583aa4aeb5ccf9354b8d',
});

const App: React.FC = () => {
  const { showModal } = useStallionModal();
  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
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
