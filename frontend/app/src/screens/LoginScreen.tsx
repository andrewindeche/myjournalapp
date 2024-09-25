import React, { useState, useEffect } from "react";
import { Colors } from "../colors";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import * as Google from "expo-auth-session/providers/google";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/auth";
import {
  setUsername,
  setPassword,
  loginUser,
  reset,
} from "../redux/LoginSlice";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "109367517835465899853",
  });

  const { username, password, status, error } = useSelector(
    (state: RootState) => state.login,
  );

  const [attempts, setAttempts] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const handleSignUpPress = () => {
    navigation.navigate("Register");
    dispatch(reset());
  };

  const handleSignInPress = () => {
    if (!isDisabled) {
      dispatch(loginUser({ username, password }))
        .unwrap()
        .then(() => {
          dispatch(setUsername(""));
          dispatch(setPassword(""));
          navigation.navigate("Summary");
        })
        .catch((error) => {
          console.error("Login failed: ", error);
        });
      setAttempts(attempts + 1);
      if (attempts + 1 >= 3) {
        const newTimer = timer > 0 ? timer + 120 : 120;
        setTimer(newTimer);
        setIsDisabled(true);
      }
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      if (timer === 1) {
        setIsDisabled(false);
      }

      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (status === "succeeded") {
      navigation.navigate("Summary");
    } else if (error) {
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 1000);

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

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .then(() => {
          dispatch(loginUser({ username: "", password: "" }));
        })
        .catch((error) => {
          console.error("Google sign-in error: ", error);
        });
    }
  }, [response, dispatch]);

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

          <Text style={styles.label}>Your Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Username"
            onChangeText={(text) => dispatch(setUsername(text))}
            value={username}
            editable={!isDisabled}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => dispatch(setPassword(text))}
            value={password}
            editable={!isDisabled}
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.signInButton, isDisabled && styles.disabledButton]}
            onPress={handleSignInPress}
            disabled={isDisabled || status === "loading"}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>

          <Pressable
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <MaterialCommunityIcons
              name="google"
              size={24}
              color={Colors.white}
            />
            <Text style={styles.googleButtonText}>Google Sign In</Text>
          </Pressable>

          <Pressable style={styles.newUser} onPress={handleSignUpPress}>
            <Text>
              I'm a new user <Text style={styles.signUpText}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.errorContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {isDisabled && (
        <Text style={styles.timerText}>
          Please wait {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}{" "}
          before trying again.
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    height: 40,
    justifyContent: "center",
  },
  errorText: {
    color: Colors.red,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginVertical: 30,
  },
  googleButton: {
    backgroundColor: Colors.googleButtonBackground,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    paddingVertical: 12,
    width: "100%",
  },
  googleButtonText: {
    color: Colors.white,
    margin: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  innerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    width: "100%",
  },
  input: {
    backgroundColor: Colors.inputBackgroundcolors,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
    height: 45,
    marginVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  newUser: {
    marginTop: 20,
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  signInButton: {
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 15,
    width: "100%",
  },
  signInButtonText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: "center",
  },
  signUpText: {
    color: Colors.color,
    fontSize: 17,
    marginRight: 10,
  },
  subtitle: {
    color: Colors.white,
    fontSize: 18,
    marginTop: 5,
    textAlign: "center",
  },
  successText: {
    color: Colors.green,
  },
  timerText: {
    color: Colors.red,
    marginVertical: 10,
    textAlign: "center",
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
