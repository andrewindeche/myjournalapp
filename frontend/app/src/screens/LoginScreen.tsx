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
        .catch(() => {
          setAttempts(attempts + 1);
          if (attempts + 1 >= 3) {
            const newTimer = timer > 0 ? timer + 120 : 120;
            setTimer(newTimer);
            setIsDisabled(true);
          }
        });
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
            style={[styles.input, isDisabled && styles.disabledInput]}
            placeholder="Your Username"
            onChangeText={(text) => dispatch(setUsername(text))}
            value={username}
            editable={!isDisabled}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, isDisabled && styles.disabledInput]}
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
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
  disabledInput: {
    backgroundColor: Colors.gray,
    borderColor: Colors.lightGray,
  },
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
  newUser: {
    marginTop: 10,
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
  timerText: {
    color: Colors.red,
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
