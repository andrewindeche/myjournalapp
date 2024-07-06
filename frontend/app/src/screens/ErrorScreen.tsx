import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ErrorScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleNavigateHome = () => {
    navigation.navigate("Home"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>An error occurred!</Text>
      <Text style={styles.errorDescription}>
        Please check your connection or try again later.
      </Text>
      <Button title="Go back to Home" onPress={handleNavigateHome} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ErrorScreen;