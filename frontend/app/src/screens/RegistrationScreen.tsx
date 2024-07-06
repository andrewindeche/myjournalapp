import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegistrationScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Registration Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistrationScreen;