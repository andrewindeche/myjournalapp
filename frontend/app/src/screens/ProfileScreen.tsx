import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
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
    if (status === "succeeded") {
      if (successMessage) {
        setModalVisible(false);
        setTimeout(() => setSuccessMessage(""), 3000);
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } else if (status === "failed" && error) {
      setErrorMessage(error);
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
        setErrorMessage(result.payload as string);
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
      </ScrollView>
      <View style={styles.menuContainer}>
        <Menu navigation={navigation} onDeleteAccount={handleDeleteAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 10,
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: "#002240",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#020035",
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#ffffff",
  },
  successText: {
    color: "green",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#0033cc",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  outerButton: {
    backgroundColor: "#004d99",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  outerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#020035",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    alignItems: "center",
    flex: 1,
  },
  loadingText: {
    color: "gray",
    fontSize: 18,
    textAlign: "center",
  },
  menuContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
  },
});

export default ProfileScreen;
