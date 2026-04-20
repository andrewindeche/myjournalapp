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
import axios from "axios";
import { API_URL } from "../redux/apiConfig";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/password-reset/`, { email });
      setStep("code");
      Alert.alert("Success", `Reset code: ${response.data.code}`);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.email?.[0] ||
          error.response?.data?.detail ||
          "Failed to send reset code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert("Error", "Please enter the code and new password.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/password-reset/confirm/`, {
        email,
        code,
        new_password: newPassword,
      });
      Alert.alert("Success", "Password reset successful! You can now login.");
      setStep("email");
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.non_field_errors?.[0] ||
          error.response?.data?.detail ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {step === "email" ? (
        <>
          <Text style={styles.subtitle}>
            Enter your email address below to receive password reset instructions.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <Pressable
            style={[styles.resetButton, loading && styles.buttonDisabled]}
            onPress={handleRequestReset}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? "Sending..." : "Send Reset Code"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your email and your new password.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Reset Code"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setCode}
            value={code}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <Pressable
            style={[styles.resetButton, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? "Resetting..." : "Reset Password"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.backButton}
            onPress={() => setStep("email")}
          >
            <Text style={styles.backButtonText}>Back to Email</Text>
          </Pressable>
        </>
      )}
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
  buttonDisabled: {
    opacity: 0.6,
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
  backButton: {
    alignItems: "center",
    marginTop: 15,
    paddingVertical: 10,
  },
  backButtonText: {
    color: Colors.loginBackgroundColor,
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
