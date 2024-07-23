import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigation } from "@react-navigation/native";
import { fetchProfileInfo, updatePassword, updateUsername } from '../redux/ProfileSlice';
import Menu from "../components/Menu";
import { setUsername } from '../redux/LoginSlice';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { username = '', email = '', status, error } = useSelector((state: RootState) => state.profile || {});
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      Alert.alert('Success', 'Profile updated successfully.');
    } else if (status === 'failed' && error) {
      Alert.alert('Error', error);
    }
  }, [status, error]);

  const handleUsernameChange = () => {
    if (newUsername.trim() !== '') {
      dispatch(updateUsername(newUsername.trim()));
      setNewUsername('');
    }
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmNewPassword) {
      dispatch(updatePassword({ old_password: oldPassword, new_password: newPassword }));
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      alert('Passwords do not match');
    }
  };

  const handleSaveChanges = () => {
    handleUsernameChange();
    handlePasswordChange();
  };

  if (!username || !email) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <Text style={styles.title}>Profile Information</Text>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Text style={styles.label}>Name: {username}</Text>
          <Text style={styles.label}>Email: {email}</Text>
        </View>
      </View>
        <TextInput
              style={styles.input}
              placeholder="Enter Username"
              onChangeText={(text) => setNewUsername(text)}
            />
         <TextInput
              style={styles.input}
              placeholder="Change username"
              onChangeText={(text) => setNewUsername(text)}
            />
        <Pressable style={styles.outerbutton} onPress={handleSaveChanges} disabled={status === 'loading'}>
          <Text style={styles.OuterButtonText}>Update Username</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleSaveChanges} disabled={status === 'loading'}>
          <Text style={styles.buttonText}>Update Password</Text>
        </Pressable>
        <Menu />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  outerContainer: {
    backgroundColor: '#020035',
    height: 10,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  innerContainer: {
    backgroundColor: 'white',
    height: '90%',
    marginBottom: 10,
    width: '100%',
    padding: 60,
  },
  input: {
    height: 40,
    borderColor: '#020035',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
  },
  button: {
    backgroundColor: '#020035',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 16,
  },
  outerbutton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#020035',
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  OuterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 13,
    margin: 2,
    color: 'white',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default ProfileScreen;
