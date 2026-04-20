import React, { useState, useEffect, useRef } from "react";
import { Colors } from "../colors";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import * as Google from "expo-auth-session/providers/google";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  setUsername,
  setPassword,
  loginUser,
  reset,
} from "../redux/LoginSlice";

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
  Profile: undefined;
  Summary: undefined;
  JournalEntry: undefined;
  Fallback: undefined;
  NotFound: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;

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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (timer > 0) {
        e.preventDefault();
        Alert.alert(
          "Action not allowed",
          `Please wait for ${Math.floor(timer / 60)}:${("0" + (timer % 60)).slice(-2)} before navigating.`,
        );
      }
    });

    return unsubscribe;
  }, [navigation, timer]);

  const handleSignUpPress = () => {
    if (timer === 0) {
      navigation.navigate("Register");
      dispatch(reset());
    }
  };

  const handleSignInPress = () => {
    if (!isDisabled) {
      setIsLoggingIn(true);
      setLoginProgress(0);

      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const progressInterval = setInterval(() => {
        setLoginProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 40);

      dispatch(loginUser({ username, password }))
        .unwrap()
        .then(() => {
          clearInterval(progressInterval);
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setIsLoggingIn(false);
              dispatch(setUsername(""));
              dispatch(setPassword(""));
              navigation.navigate("Summary");
            });
          }, 500);
        })
        .catch((error) => {
          clearInterval(progressInterval);
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsLoggingIn(false);
          });
          console.error("Login failed: ", error);
        });
      setAttempts(attempts + 1);
      if (attempts + 1 >= 4) {
        const newTimer = timer > 0 ? timer + 120 : 120;
        setTimer(newTimer);
        setIsDisabled(true);
      }
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
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
      }, 2000);

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
      {isLoggingIn && (
        <Animated.View style={[styles.loaderOverlay, { opacity: opacityAnim }]}>
          <Animated.View
            style={[
              styles.loaderContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.loaderInner}>
              <Text style={styles.loaderText}>Journal</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${loginProgress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{loginProgress}%</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
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
            placeholder="Enter Your Username"
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
              I&apos;m a new user <Text style={styles.signUpText}>Sign up</Text>
            </Text>
          </Pressable>

          <Pressable style={styles.footer} onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.errorContainer}>
        {Array.isArray(error) &&
          error.map((msg, index) => (
            <Text key={index} style={styles.errorText}>
              {msg}
            </Text>
          ))}
        {!Array.isArray(error) && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {isDisabled && (
          <Text style={styles.timerText}>
            Please wait {Math.floor(timer / 60)}:
            {("0" + (timer % 60)).slice(-2)} before trying again.
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    height: 20,
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: Colors.red,
    flex: 1,
    marginVertical: 10,
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
  loaderContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: Colors.color,
    borderRadius: 75,
    borderWidth: 4,
    height: 150,
    justifyContent: "center",
    width: 150,
  },
  loaderInner: {
    alignItems: "center",
  },
  loaderOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  loaderText: {
    color: Colors.color,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  newUser: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: Colors.loginBackgroundColor,
    fontSize: 16,
    marginTop: 10,
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  progressBar: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    height: 8,
    overflow: "hidden",
    width: 100,
  },
  progressFill: {
    backgroundColor: Colors.color,
    height: "100%",
  },
  progressText: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 10,
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
