import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default LoadingScreen;
