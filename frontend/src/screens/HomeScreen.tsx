import React from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';

const HomeScreen: React.FC = () => {
    return(
    <View style={ styles.container}>
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
  container: {
    fontFamily: 'mulish-regular',
  },
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    width: '100%',
  },
  section: {
    backgroundColor: '#020035',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    fontSize: 8,
    justifyContent: 'center',
    width: '95%',
    borderRadius: 8,
    fontWeight: 'bold',
  },
  image: {
    width: '90%',
    height: 300,
    borderRadius: 100,
  },
  text: {
    fontSize: 10,
    color: 'black',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#020035',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  header: {
    display: 'flex',
    gap:10,
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 10,
    color: 'white',
  },
  footer: {
    flexDirection: 'column',
    padding: 20,
    gap: 8,
    backgroundColor: '#020035',
    height: '100%',
    width: '100%'
  },
});

export default HomeScreen;
