import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../colors";
import { NavigationProp } from "@react-navigation/native";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

interface MenuProps {
  onClose: () => void;
  navigation: NavigationProp<any>;
}

const SubMenu: React.FC<MenuProps> = ({ onClose, navigation }) => {
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    onClose();
    navigation.navigate("Login");
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("Summary")}
        >
          <Icon name="home-outline" size={24} color="white" />
          <Text style={styles.menuText}>Home</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="settings-outline" size={24} color="white" />
          <Text style={styles.menuText}>Settings</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <Icon name="exit-outline" size={24} color="white" />
          <Text style={styles.menuText}>Logout</Text>
        </Pressable>
      </View>
      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: Colors.color,
    borderRadius: 5,
    elevation: 75,
    padding: 10,
    position: "absolute",
    right: 0,
    top: 30,
  },
  menuContainer: {
    color: Colors.white,
    position: "relative",
  },
  menuItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  menuText: {
    color: Colors.white,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default SubMenu;
