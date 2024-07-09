import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const JournalEntryScreen: React.FC = () => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="arrow-back" size={24} color="#000" />
          <Icon name="menu" size={24} color="#000" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Tax payment before the end of March</Text>
          <Text style={styles.text}>This is a reminder note, so as not to forget to pay taxes before the end of March. Don't miss it; you could be fined!</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity>
            <Icon name="home-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ADD8E6',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    text: {
      fontSize: 16,
      marginBottom: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
    },
  });
  
  export default JournalEntryScreen;