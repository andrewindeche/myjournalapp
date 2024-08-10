import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const ProgressOverlay = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.text}>Uploading...</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'white',
    marginTop: 10,
  },
});

export default ProgressOverlay;
