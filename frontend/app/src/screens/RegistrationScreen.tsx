import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../colors";
import {
  registerUser,
  setEmail,
  setFullName,
  setConfirmPassword,
  setPassword,
  reset,
} from "../redux/RegistrationSlice";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native";

const RegistrationScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {
    username,
    email,
    password,
    confirm_password,
    status,
    successMessage,
    error,
  } = useSelector((state: RootState) => state.registration);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      navigation.navigate("Login");
      dispatch(reset());
    }
  }, [status, navigation, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleSignUpPress = () => {
    dispatch(registerUser({ username, email, password, confirm_password }))
      .unwrap()
      .catch(() => {
        dispatch(reset());
      });
  };

  return (
    <>
      <View style={styles.outerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Let's Begin</Text>
          <Text style={styles.subtitle}>Create an Account</Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.title, styles.inputText]}>Sign Up</Text>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            onChangeText={(text) => dispatch(setFullName(text))}
            value={username}
          />
          <Text>
            {username.includes(" ") && (
              <FontAwesome name="check" size={20} color="green" />
            )}
          </Text>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            onChangeText={(text) => dispatch(setEmail(text))}
            value={email}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            onChangeText={(text) => dispatch(setPassword(text))}
            value={password}
          />
          {password && (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                onChangeText={(text) => dispatch(setConfirmPassword(text))}
                secureTextEntry
                value={confirm_password}
              />
            </>
          )}
          <View style={styles.footer}>
            <Pressable
              style={styles.signUpButton}
              onPress={handleSignUpPress}
              disabled={status === "loading"}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </Pressable>
            <Pressable
              style={styles.registeredUser}
              onPress={() => navigation.navigate("Login")}
            >
              <Text>Already have an Account?</Text>
              <Text style={styles.signInText}>Log In</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    marginTop: 30,
    marginVertical: 10,
    textAlign: "center",
  },
  footer: {
    margin: 12,
  },
  header: {
    alignItems: "center",
    color: Colors.white,
    display: "flex",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  innerContainer: {
    backgroundColor: Colors.white,
    height: "80%",
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.inputBackgroundcolors,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "95%",
  },
  inputContainer: {
    padding: 20,
  },
  inputText: {
    color: Colors.loginBackgroundColor,
    padding: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    flex: 1,
    height: 10,
    width: "100%",
  },
  registeredUser: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  signInText: {
    color: Colors.color,
    fontSize: 20,
  },
  signUpButton: {
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: "90%",
  },
  signUpButtonText: {
    color: Colors.white,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.white,
    fontSize: 14,
  },
  successText: {
    color: Colors.green,
    marginTop: 30,
    marginVertical: 10,
    textAlign: "center",
  },
  title: {
    alignItems: "center",
    color: Colors.white,
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default RegistrationScreen;
