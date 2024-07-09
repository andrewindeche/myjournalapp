import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Menu: React.FC  = () => {
  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
      <TouchableOpacity style={styles.menuItem}>
          <Icon name="home-outline" size={24} color="black" />
          <Text style={styles.menuText}>Journal List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="document-text-outline" size={24} color="black" />
          <Text style={styles.menuText}>Journal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="exit-outline" size={24} color="black" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 30,
    backgroundColor: '#CB7723',
    borderRadius: 5,
    padding: 10,
    elevation: 75,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    color: 'white',
  },
});

export default Menu;
