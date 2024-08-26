import React, { useState, useEffect } from "react";
import { Colors } from "../colors";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  setUsername,
  setPassword,
  loginUser,
  reset,
} from "../redux/LoginSlice";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { username, password, status, error } = useSelector(
    (state: RootState) => state.login,
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUpPress = () => {
    navigation.navigate("Register");
    dispatch(reset());
  };

  const handleSignInPress = () => {
    dispatch(loginUser({ username, password })).unwrap();
    navigation.navigate("Summary");
  };

  useEffect(() => {
    if (status === "succeeded") {
      navigation.navigate("Summary");
    } else if (error) {
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, error, navigation, dispatch]);

  useEffect(() => {
    const { successMessage } =
      navigation.getState().routes.find((route) => route.name === "Login")
        ?.params || {};
    if (successMessage) {
      setSuccessMessage(successMessage);
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [navigation]);

  return (
    <>
      <View style={styles.outerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to your journal</Text>
          <Text style={styles.subtitle}>Sign Into Your Account</Text>
        </View>
      </View>
      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
      <View style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.title, styles.inputText]}>Sign In</Text>
          <Text style={styles.label}>Your UserName</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Username"
            onChangeText={(text) => dispatch(setUsername(text))}
            value={username}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => dispatch(setPassword(text))}
            value={password}
          />
        </View>
        <View style={styles.footer}>
          <Pressable style={styles.signInButton}>
            <Text
              style={styles.signInButtonText}
              onPress={handleSignInPress}
              disabled={status === "loading"}
            >
              Sign In
            </Text>
          </Pressable>
          <Pressable style={styles.newUser} onPress={handleSignUpPress}>
            <Text>I'm a new user</Text>
            <Text style={styles.signUpText}>Sign up</Text>
          </Pressable>
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    marginVertical: 10,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    display: "flex",
    gap: 10,
  },
  header: {
    alignItems: "center",
    color: Colors.white,
    display: "flex",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    padding: 17,
  },
  inputText: {
    color: Colors.loginBackgroundColor,
    fontWeight: "bold",
    padding: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: Colors.inputBackgroundcolors,
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  newUser: {
    marginTop: 10,
  },
  okButton: {
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  okButtonText: {
    color: Colors.color,
    fontSize: 16,
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    flex: 1,
    height: 10,
    width: "100%",
  },
  signInButton: {
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: "90%",
  },
  signInButtonText: {
    color: Colors.white,
    textAlign: "center",
  },
  signUpText: {
    color: Colors.color,
    fontSize: 20,
  },
  subtitle: {
    color: Colors.white,
    fontSize: 14,
  },
  successText: {
    color: Colors.green,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  title: {
    alignItems: "center",
    color: Colors.white,
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default LoginScreen;
