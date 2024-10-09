import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Colors } from "../colors";

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

interface FallbackComponentProps {
  navigation: NavigationProp<RootStackParamList>;
}

const FallbackComponent: React.FC<FallbackComponentProps> = ({
  navigation,
}) => {
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
    color: Colors.red,
    fontSize: 18,
  },
});

export default FallbackComponent;
