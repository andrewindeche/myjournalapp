import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const FallbackComponent: React.FC = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Page not found</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  message: {
    color: "red",
    fontSize: 18,
  },
});

export default FallbackComponent;
