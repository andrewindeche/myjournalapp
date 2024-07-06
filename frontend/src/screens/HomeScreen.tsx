import React from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';

const HomeScreen: React.FC = () => {
    return(
    <View>
    <View style={styles.section}>
    <View style={styles.outerContainer}>
    <Image
      style={styles.image}
      resizeMode="cover"
      source={require('@/assets/images/journaler.jpg')}
    />
    </View>
    <View style={styles.innerContainer}>
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
        </View>
    )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
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
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  innerContainer: {
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

export default HomeScreen;
