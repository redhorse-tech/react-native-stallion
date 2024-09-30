import * as React from 'react';

import { StyleSheet, View, Button, Text } from 'react-native';
import { withStallion, useStallionModal } from 'react-native-stallion';

const App: React.FC = () => {
  const { showModal } = useStallionModal();
  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
      <Button title="OpenModal" onPress={showModal} />
    </View>
  );
};

export default withStallion(App, {
  projectId: '66eed6374886bd3ba22add70',
});

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
