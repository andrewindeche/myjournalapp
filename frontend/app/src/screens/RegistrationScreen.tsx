import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setEmail, setFullName, setPassword, reset } from '../redux/RegistrationSlice';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';

const RegistrationScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { fullName, email, password, status } = useSelector((state: RootState) => state.registration);
  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignUpPress = () => {
    dispatch(registerUser({ username, email, password }))
      .then(() => {
        navigation.navigate('Login');
        dispatch(reset());
      });
  };

  const handleFullNameChange = (text: string) => {
    dispatch(setFullName(text));
    setIsFullNameValid(text.trim().includes(' '));
  };

  const handleEmailChange = (text: string) => {
    dispatch(setEmail(text));
  };

  const handlePasswordChange = (text: string) => {
    dispatch(setPassword(text));
  };

  const handleSignInPress = () => {
    navigation.navigate('Login');
  };
  
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
        onChangeText={handleFullNameChange}
        value={username}
      />
      {fullName.includes(' ') && <FontAwesome name="check" size={20} color="green" />}
    <Text style={styles.label}>Email Address</Text>
    <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={handleEmailChange}
        value={email}
        {.../\S+@\S+\.\S+/.test(email) && <FontAwesome name="check" size={20} color="green" />}
      />
    <Text style={styles.label}>Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!passwordVisible}
        onChangeText={handlePasswordChange}
        value={password}
      />
       <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
        <FontAwesome name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
      </Pressable>
      <View style={styles.footer}>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignUpPress} disabled={status === 'loading'}>
        <Text style={styles.signInButtonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registeredUser} onPress={() => navigation.navigate('Login')}>
        <Text>Already have an Account?</Text>
        <Text style={styles.signInText}>Log In</Text>
      </TouchableOpacity>
      </View>
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
  footer: {
    margin: 12,
  },
  registeredUser: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  signInButton: {
    backgroundColor: '#020035',
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '90%',
    borderRadius: 8,
    marginBottom: 10,
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  signInText: {
    fontSize: 20,
    color: '#CB7723'
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
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
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