import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Menu: React.FC  = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handlePressIn = () => setShowMenu(true);
  const handlePressOut = () => setShowMenu(false);

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon name="menu" size={24} color="white" />
      </TouchableOpacity>
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="exit-outline" size={24} color="black" />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="document-text-outline" size={24} color="black" />
            <Text style={styles.menuText}>Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="home-outline" size={24} color="black" />
            <Text style={styles.menuText}>Categories</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
  },
});

export default Menu;
