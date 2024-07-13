import React, { useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setUsername, setPassword, loginUser, reset } from '../redux/LoginSlice';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { username, password, status, error } = useSelector((state: RootState) => state.login);

  const handleSignUpPress = () => {
    navigation.navigate('Register');
    dispatch(reset());
  };

  const handleSignInPress = () => {
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then(() => {
        dispatch(reset());
        navigation.navigate('JournalEntry'); 
      })
      .catch(() => {
        dispatch(reset());
      });
  };

  useEffect(() => {
    if (status === 'succeeded') {
      navigation.navigate('JournalEntry');
    }
  }, [status, navigation]);

  return (
    <>
    <View style={styles.outerContainer}>
      <View style={styles.header}>
      <Text style={styles.title}>Welcome to your journal</Text>
      <Text style={styles.subtitle}>Sign Into Your Account</Text>
      </View>
    </View>
    <View style={styles.innerContainer}>
      <View style={styles.inputContainer}>
    <Text style={[styles.title, styles.inputText]}>Sign In</Text>
    <Text style={styles.label}>Your UserName</Text>
    <TextInput
        style={styles.input}
        placeholder="Your Username"
        onChangeText={(text) => dispatch(setUsername(text))}
        value={username}
      />
    <Text style={styles.label}>Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => dispatch(setPassword(text))}
        value={password}
      />
      </View>
      <View style={styles.footer}>
      <Pressable style={styles.signInButton}>
        <Text style={styles.signInButtonText} onPress={handleSignInPress} disabled={status === 'loading'}>Sign In</Text>
      </Pressable>
      <Pressable style={styles.newUser} onPress={handleSignUpPress}>
        <Text>I'm a new user</Text>
        <Text style={styles.signUpText}>Sign up</Text>
      </Pressable>
      </View>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  innerContainer: {
    backgroundColor: 'white',
    height: '80%',
    marginBottom: 10,
  },
  inputText: {
    color: '#020035',
    padding: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 17,
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
  signInButton: {
    backgroundColor: '#020035',
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '90%',
    borderRadius: 8,
    marginBottom: 10,
  },
  signUpText: {
    fontSize: 20,
    color: '#CB7723'
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  newUser: {
    marginTop: 10,
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
  },
  text: {
    fontSize: 10,
    color: 'white',
  },
});

export default LoginScreen;