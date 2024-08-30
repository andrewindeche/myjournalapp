import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Colors } from "../colors";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { deleteUserAccount } from "../redux/ProfileSlice";

interface MenuProps {
  navigation: NavigationProp<any>;
  onDeleteAccount: () => void;
}

const Menu: React.FC<MenuProps> = ({ navigation, onDeleteAccount }) => {
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    navigation.navigate("Login");
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await dispatch(deleteUserAccount()).unwrap();
      dispatch(logout());
      onDeleteAccount();
      Alert.alert("Success", "Account deleted successfully.");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Failed to delete account.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("Summary")}
        >
          <Icon name="home-outline" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("JournalEntry")}
        >
          <Icon name="document-text-outline" size={24} color="black" />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={handleDeleteAccount}>
          <Icon name="trash-outline" size={24} color="black" />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <Icon name="exit-outline" size={24} color="black" />
        </Pressable>
      </View>
      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    borderRadius: 5,
    color: Colors.color,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    position: "relative",
  },
  menuContainer: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    display: "flex",
    justifyContent: "space-around",
    paddingVertical: 8,
    position: "relative",
  },
  menuItem: {
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 30,
    paddingVertical: 4,
  },
});

export default Menu;
