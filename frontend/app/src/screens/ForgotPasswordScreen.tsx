import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors } from "../colors";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleResetPassword = () => {
    Alert.alert(
      "Password Reset",
      "Instructions to reset your password have been sent to your email.",
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below to receive password reset instructions.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <Pressable style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteSmoke,
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    backgroundColor: Colors.snow,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    height: 45,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 8,
    paddingVertical: 15,
  },
  resetButtonText: {
    color: Colors.footer,
    fontSize: 18,
  },
  subtitle: {
    color: Colors.dimGray,
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    color: Colors.loginBackgroundColor,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ForgotPasswordScreen;
