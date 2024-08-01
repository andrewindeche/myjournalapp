import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

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
    backgroundColor: "#F5F5F5",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#020035",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#555",
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    height: 45,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: "#020035",
    borderRadius: 8,
    paddingVertical: 15,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
