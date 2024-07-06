import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';

const RegistrationScreen: React.FC = () => {
  return (
    <>
    <View style={styles.outerContainer}>
      <View style={styles.header}>
      <Text style={styles.title}>Let's Begin</Text>
      <Text style={styles.subtitle}>Create an Account</Text>
      </View>
    </View>
    <View style={styles.innerContainer}>
      <View style={styles.inputContainer}>
    <Text style={[styles.title, styles.inputText]}>Sign Up</Text>
    <Text style={styles.label}>Full Name</Text>
    <TextInput
        style={styles.input}
        placeholder="Full Name"
      />
    <Text style={styles.label}>Email Address</Text>
    <TextInput
        style={styles.input}
        placeholder="Email Address"
      />
    <Text style={styles.label}>Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      </View>
    </View>
    </>
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
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  innerContainer: {
    backgroundColor: 'white',
    height: '80%',
    marginBottom: 10,
  },
  inputText: {
    color: '#020035',
    padding: 5
  },
  inputContainer: {
    padding: 20,
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
    width: '95%',
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

export default RegistrationScreen;