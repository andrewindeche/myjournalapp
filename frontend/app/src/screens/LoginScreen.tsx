import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
    <View style={styles.outerContainer}>
      <View style={styles.header}>
      <Text style={styles.title}>Welcome to your journal</Text>
      <Text style={styles.subtitle}>Sign Into Your Account</Text>
      </View>
    </View>
    <View style={styles.outerContainer}>
    <TextInput
        style={styles.input}
        placeholder="Your Email"
      />
    <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        // Other input props...
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerContainer: {
    backgroundColor: '#020035',
    height: 10,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    gap:10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    color: 'white',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: 'white',
  }
});

export default LoginScreen;