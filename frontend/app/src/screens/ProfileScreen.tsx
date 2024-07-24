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
  const [successMessage, setSuccessMessage] = useState("");

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
    } else if (status === "failed" && error) {
      Alert.alert("Error", error);
      setModalVisible(false);
    }
  }, [status, error, successMessage]);

  const handleUsernameChange = () => {
    if (newUsername.trim() !== "") {
      dispatch(updateUsername(newUsername.trim()));
      setNewUsername("");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSuccessMessage("");
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmNewPassword) {
      dispatch(
        updatePassword({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      alert("Passwords do not match");
    }
  };

  const handlePasswordChangeConfirmation = () => {
    if (newPassword === confirmNewPassword) {
      dispatch(
        updatePassword({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      );
      setSuccessMessage("Password changed successfully.");
    } else {
      Alert.alert("Error", "Passwords do not match");
      setModalVisible(false);
    }
  };

  const openPasswordChangeModal = () => {
    setModalVisible(true);
  };

  const handleDeleteAccount = () => {
    dispatch(deleteUserAccount());
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
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        onChangeText={(text) => setNewUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Change username"
        onChangeText={(text) => setNewUsername(text)}
      />
      <Pressable
        style={styles.outerbutton}
        onPress={handleUsernameChange}
        disabled={status === "loading"}
      >
        <Text style={styles.OuterButtonText}>Update Username</Text>
      </Pressable>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
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
  button: {
    backgroundColor: "#020035",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 16,
  },
  outerbutton: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#020035",
    borderWidth: 1,
    borderColor: "white",
    marginBottom: 16,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
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
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#020035",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  label: {
    fontSize: 13,
    margin: 2,
    color: "white",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
