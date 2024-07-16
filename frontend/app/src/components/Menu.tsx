import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';


const Menu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); 
    onClose(); 
  };

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Summary')}>
          <Icon name="home-outline" size={24} color="black" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile')}>
          <Icon name="document-text-outline" size={24} color="black" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="exit-outline" size={24} color="black" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Icon: {
    color: 'white',
  },
  menu: {
    backgroundColor: '#CB7723',
    borderRadius: 5,
    elevation: 75,
    padding: 10,
    position: 'absolute',
    right: 0,
    color: 'white',
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
