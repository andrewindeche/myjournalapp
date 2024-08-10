import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../colors";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native";
import {
  fetchProfileInfo,
  updatePassword,
  updateUsername,
  deleteUserAccount,
} from "../redux/ProfileSlice";
import Menu from "../components/Menu";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    username = "",
    email = "",
    status,
    error = "",
  } = useSelector((state: RootState) => state.profile || {});
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      if (successMessage) {
        setModalVisible(false);
        setTimeout(() => setSuccessMessage(""), 3000);
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } else if (status === "failed") {
      setErrorMessage(
        typeof error === "string"
          ? error
          : "error.Please check your password values",
      );
      setModalVisible(false);
      setUsernameModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 2000);
    }
  }, [status, error, successMessage]);

  const handleUsernameChangeConfirmation = () => {
    if (newUsername.trim() !== "") {
      dispatch(updateUsername(newUsername.trim()));
      setUsernameModalVisible(false);
      setSuccessMessage("Username updated successfully.");
    } else {
      setErrorMessage("Username cannot be empty");
      setUsernameModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
        setNewUsername("");
      }, 2000);
    }
  };

  const openUsernameChangeModal = () => {
    setUsernameModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSuccessMessage("");
  };

  const handlePasswordChangeConfirmation = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setModalVisible(false);
      setErrorMessage("Password fields cannot be empty");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setModalVisible(false);
      setErrorMessage("Passwords do not match");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    dispatch(
      updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      }),
    ).then((result) => {
      if (updatePassword.fulfilled.match(result)) {
        setUsernameModalVisible(false);
        setSuccessMessage("Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else if (updatePassword.rejected.match(result)) {
        setErrorMessage(
          typeof result.payload === "string"
            ? result.payload
            : "error updating, check password values",
        );
      }
    });
  };

  const openPasswordChangeModal = () => {
    setModalVisible(true);
  };

  const handleDeleteAccount = () => {
    dispatch(deleteUserAccount());
  };

  const closeUsernameModal = () => {
    setUsernameModalVisible(false);
  };

  if (status === "loading") {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!username || !email) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.outerContainer}>
          <Text style={styles.title}>Profile Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name: {username}</Text>
            <Text style={styles.label}>Email: {email}</Text>
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        </View>
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to change your password?
              </Text>
              <View style={styles.modalButtonsContainer}>
                <Pressable
                  style={styles.modalButton}
                  onPress={handlePasswordChangeConfirmation}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={usernameModalVisible}
          animationType="slide"
          onRequestClose={closeUsernameModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to change your username?
              </Text>
              <View style={styles.modalButtonsContainer}>
                <Pressable
                  style={styles.modalButton}
                  onPress={handleUsernameChangeConfirmation}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={closeUsernameModal}
                >
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <TextInput
          style={[
            styles.input,
            errorMessage.includes("Username") && styles.errorInput,
          ]}
          placeholder={
            errorMessage.includes("Username")
              ? errorMessage
              : "Enter New Username"
          }
          onChangeText={(text) => setNewUsername(text)}
          value={newUsername}
        />
        <Pressable
          style={styles.outerButton}
          onPress={openUsernameChangeModal}
          disabled={status === "loading"}
        >
          <Text style={styles.outerButtonText}>Update Username</Text>
        </Pressable>
        <TextInput
          style={[
            styles.input,
            typeof errorMessage === "string" &&
              errorMessage.includes("Password") &&
              styles.errorInput,
          ]}
          placeholder={
            typeof errorMessage === "string" &&
            errorMessage.includes("Password")
              ? errorMessage
              : "Current Password"
          }
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          style={[
            styles.input,
            typeof errorMessage === "string" &&
              errorMessage.includes("Password") &&
              styles.errorInput,
          ]}
          placeholder={
            typeof errorMessage === "string" &&
            errorMessage.includes("Password")
              ? errorMessage
              : "Confirm New Password"
          }
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={[
            styles.input,
            errorMessage.includes("Password") && styles.errorInput,
          ]}
          placeholder={
            errorMessage.includes("Password")
              ? errorMessage
              : "Confirm New Password"
          }
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
        <Pressable
          style={styles.button}
          onPress={openPasswordChangeModal}
          disabled={status === "loading"}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.menuContainer}>
        <Menu navigation={navigation} onDeleteAccount={handleDeleteAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: Colors.kleinBlue,
    borderRadius: 5,
    marginVertical: 10,
    padding: 15,
  },
  buttonText: {
    color: Colors.profilebuttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: Colors.profileContainerBackgroundColor,
    flex: 1,
  },
  errorInput: {
    borderColor: Colors.red,
  },
  errorText: {
    color: Colors.red,
    fontSize: 16,
    marginTop: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.profilebuttonText,
    borderColor: Colors.profileBorderColors,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
  },
  label: {
    color: Colors.profilebuttonText,
    fontSize: 18,
    marginBottom: 5,
  },
  loadingText: {
    color: Colors.gray,
    fontSize: 18,
    textAlign: "center",
  },
  menuContainer: {
    backgroundColor: Colors.profilebuttonText,
    borderTopColor: Colors.profileBorderColors,
    borderTopWidth: 1,
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  modalBackground: {
    alignItems: "center",
    backgroundColor: Colors.modalBackdroundColor,
    flex: 1,
    justifyContent: "center",
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: Colors.profilebuttonText,
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  outerButton: {
    alignItems: "center",
    backgroundColor: Colors.cobalt,
    borderRadius: 5,
    marginVertical: 10,
    padding: 15,
  },
  outerButtonText: {
    color: Colors.profilebuttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.profileOuterContainerBackgroundColor,
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 10,
  },
  successText: {
    color: Colors.green,
    fontSize: 16,
    marginTop: 10,
  },
  title: {
    color: Colors.profilebuttonText,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ProfileScreen;
