import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";

interface MenuProps {
  onClose: () => void;
  navigation: NavigationProp<any>;
}

const Menu: React.FC<MenuProps> = ({ onClose, navigation }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigation.navigate("Home");
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
          <Icon name="document-text-outline" size={24} color="white" />
          <Text style={styles.menuText}>Profile</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <Icon name="exit-outline" size={24} color="white" />
          <Text style={styles.menuText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#CB7723',
    borderRadius: 5,
    elevation: 75,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 30,
  },
  menuContainer: {
    position: 'relative',
    color: 'white',
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  menuText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default Menu;