import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Colors } from "../colors";

const ProgressOverlay = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.text}>Uploading...</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: Colors.semiBlack,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  text: {
    color: Colors.white,
    marginTop: 10,
  },
});

export default ProgressOverlay;
