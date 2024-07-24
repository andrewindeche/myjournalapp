import React from 'react';
import { View, Pressable, StyleSheet,Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp} from '@react-navigation/native';

interface MenuProps {
  navigation: NavigationProp<any>;
  onDeleteAccount: () => void;
}

const Menu: React.FC<MenuProps> = ({ navigation, onDeleteAccount  }) =>  {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); 
    navigation.navigate("Home");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Delete', onPress: onDeleteAccount },
      ]
    );
  };

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('Summary')}>
          <Icon name="home-outline" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('JournalEntry')}>
          <Icon name="document-text-outline" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={handleDeleteAccount}>
          <Icon name="trash-outline" size={24} color="black" />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <Icon name="exit-outline" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    borderRadius: 5,
    elevation: 3,
    padding: 5,
    position: 'relative',
    color: '#CB7723',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuContainer: {
    position: 'relative',
    backgroundColor: 'white',
    alignItems: "center",
    borderColor: "#ccc",
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 4,
    marginHorizontal: 30,
  },
});

export default Menu;
