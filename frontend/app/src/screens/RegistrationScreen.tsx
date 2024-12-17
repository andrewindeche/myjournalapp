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
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
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
  const [attempts, setAttempts] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      navigation.navigate("Login", {
        successMessage: "Account created successfully!",
      });
    } else if (error) {
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, error, navigation, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (attempts >= 3) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [attempts]);

  const handleSignUpPress = () => {
    dispatch(registerUser({ username, email, password, confirm_password }))
      .unwrap()
      .then(() => {
        navigation.navigate("Login", {
          successMessage: "Account created successfully!",
        });
      })
      .catch((error) => {
        setErrors(error);
        setAttempts((prev) => prev + 1);

        setTimeout(() => {
          setErrors({});
        }, 4000);
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
          <Text style={styles.title}>Sign Up</Text>

          <Text>Full Name</Text>
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

          <Text>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            onChangeText={(text) => dispatch(setEmail(text))}
            value={email}
          />

          <Text>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            onChangeText={(text) => dispatch(setPassword(text))}
            value={password}
          />

          {password && (
            <>
              <Text>Confirm Password</Text>
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
              <Text>
                Already have an Account?{" "}
                <Text style={styles.signInText}>Log In</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.errorContainer}>
        {Object.keys(errors).length > 0 && (
          <View>
            {Object.keys(errors).map((key) => (
              <Text key={key} style={styles.errorText}>
                {errors[key]}
              </Text>
            ))}
          </View>
        )}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>User Registration Tip</Text>
            <Text>
              <ul>
                <li>Ensure password and confirmed passwords match</li>
                <li>Enter correct details in Username and Password Fields</li>
                <li>
                  Ensure password is at least 8 characters long and contains a
                  mix of letters, numbers, and special characters.
                </li>
              </ul>
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    height: 80,
    justifyContent: "center",
    marginVertical: 10,
  },
  errorText: {
    color: Colors.red,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginVertical: 30,
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
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  registeredUser: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    color: Colors.color,
    fontSize: 17,
    margin: 4,
  },
  signUpButton: {
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 15,
    width: "100%",
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.white,
    fontSize: 18,
    marginTop: 5,
    textAlign: "center",
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RegistrationScreen;
