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
    <View>
      <View style={styles.outerContainer}>
        <Text style={styles.title}>Profile Information</Text>
        <View style={{ alignItems: 'center', padding: 3 }}>
          <Text style={styles.label}>Name: {username}</Text>
          <Text style={styles.label}>Email: {email}</Text>
        </View>
      </View>
        <Pressable style={styles.outerbutton} onPress={handleSaveChanges} disabled={status === 'loading'}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
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
        <Text style={styles.label}>Password</Text>
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
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  outerContainer: {
    backgroundColor: '#020035',
    height: 10,
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'white',
    height: '90%',
    marginBottom: 10,
    padding: 60,
  },
  input: {
    height: 40,
    borderColor: 'gray',
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
  },
  outerbutton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
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
  label: {
    fontSize: 6,
    margin: 2,
  },
  title: {
    color: 'white',
  }
});

export default ProfileScreen;
