import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import { Colors } from "../colors";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  JournalEntry: undefined;
};

interface MenuProps {
  navigation: NavigationProp<RootStackParamList>;
  onDeleteAccount: () => void;
}

const HomeMenu: React.FC<MenuProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("JournalEntry")}
        >
          <Icon name="document-text-outline" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="settings-outline" size={24} color="black" />
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

export default HomeMenu;
