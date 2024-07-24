import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
    error,
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
    if (
      status === "succeeded" &&
      successMessage === "Password changed successfully."
    ) {
      Alert.alert("Success", "Profile updated successfully.");
      setNewUsername("");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessMessage("");
      setModalVisible(false);
    } else if (
      status === "succeeded" &&
      successMessage === "Username updated successfully."
    ) {
      Alert.alert("Success", successMessage);
      setNewUsername("");
      setSuccessMessage("");
      setUsernameModalVisible(false);
    } else if (status === "failed" && error) {
      setErrorMessage(error);
      Alert.alert("Error", error);
      setModalVisible(false);
      setUsernameModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 4000);
    }
  }, [status, error, successMessage]);

  useEffect(() => {
    if (status === "failed" && error) {
      setErrorMessage(error);
      setModalVisible(false);
      setUsernameModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 4000);
    }
  }, [status, error, successMessage]);

  const handleUsernameChangeConfirmation = () => {
    if (newUsername.trim() !== "") {
      dispatch(updateUsername(newUsername.trim()));
      setSuccessMessage("Username updated successfully.");
    } else {
      setErrorMessage("Username cannot be empty");
      setUsernameModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
        setNewUsername("");
      }, 4000);
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
      setErrorMessage("Password fields cannot be empty");
      setModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
      setModalVisible(false);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }
    dispatch(
      updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      }),
    );
    setSuccessMessage("Password changed successfully.");
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

  if (!username || !email) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <Text style={styles.title}>Profile Information</Text>
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={styles.label}>Name: {username}</Text>
          <Text style={styles.label}>Email: {email}</Text>
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
        style={styles.outerbutton}
        onPress={openUsernameChangeModal}
        disabled={status === "loading"}
      >
        <Text style={styles.OuterButtonText}>Update Username</Text>
      </Pressable>
      <TextInput
        style={[
          styles.input,
          errorMessage.includes("Password") && styles.errorInput,
        ]}
        placeholder={
          errorMessage.includes("Password") ? errorMessage : "Current Password"
        }
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <TextInput
        style={[
          styles.input,
          errorMessage.includes("Password") && styles.errorInput,
        ]}
        placeholder={
          errorMessage.includes("Password") ? errorMessage : "New Password"
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
      <Menu navigation={navigation} onDeleteAccount={handleDeleteAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: "#020035",
    flex: 1,
    height: 10,
    marginBottom: 16,
    width: "100%",
  },
  errorInput: {
    borderColor: "red",
    color: "red",
  },
  innerContainer: {
    backgroundColor: "white",
    height: "90%",
    marginBottom: 10,
    width: "100%",
    padding: 60,
  },
  input: {
    height: 40,
    borderColor: "#020035",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0, 0, 255, 0.1)",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#020035",
    borderRadius: 4,
    marginBottom: 16,
    paddingVertical: 12,
  },
  outerbutton: {
    alignItems: "center",
    backgroundColor: "#020035",
    borderColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
    paddingVertical: 12,
  },
  footer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  OuterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalBackground: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: "#020035",
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  label: {
    color: "white",
    fontSize: 13,
    margin: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
