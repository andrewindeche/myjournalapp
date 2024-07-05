import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

export default function HomeScreen() {
    return(

    <View style={styles.section}>
    <View>

    </View>
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.title}>Everyday has a Story!</Text>
        <Text style={styles.title}>Write Yours</Text>
        <Text style={styles.subtitle}>Dive into Creativity</Text>
        <Text style={styles.subtitle}> Document Your Imagination</Text>
      </View>
      <View style={styles.footer}>
      <Pressable style={styles.pressable} onPress={() => console.log('Pressed')}>
      <Text style={styles.text}>Sign In</Text>
    </Pressable>
    <Pressable style={[styles.pressable, styles.register]} onPress={() => console.log('Pressed')}>
      <Text style={[styles.text, styles.registerText]}>Register</Text>
    </Pressable>
        </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#020035',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    padding: 10,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    fontSize: 8,
    justifyContent: 'center',
    width: 250,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    color: 'white',
  },
  register: {
    backgroundColor: '#020035',
    borderColor: 'white',
    borderWidth: 2,
    
  },
  registerText: {
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 20,
    gap: 15
  },
});
