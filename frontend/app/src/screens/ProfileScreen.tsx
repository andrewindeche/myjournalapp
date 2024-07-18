import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigation } from "@react-navigation/native";
import { fetchProfileInfo, updateProfileImage, updatePassword, updateUsername } from '../redux/ProfileSlice';
import Menu from "../components/Menu";
import { setUsername } from '../redux/LoginSlice';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {username, email, profileImage, status, error } = useSelector((state: RootState) => state.profile);
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  const handleProfileImageChange = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('profile_image', selectedImage);
      dispatch(updateProfileImage(formData));
      setSelectedImage(null);
    }
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
    handlePasswordChange();
    handleProfileImageChange();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <Text style={styles.title}>Profile Information</Text>
        <View style={{ alignItems: 'center', padding: 16 }}>
          <Text style={styles.label}>Name: {username}</Text>
          <Text style={styles.label}>Email: {email}</Text>
        </View>
      </View>
        <Pressable onPress={handleSaveChanges} disabled={status === 'loading'}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
        <TextInput
              style={styles.input}
              placeholder="Enter Username"
              onChangeText={(text) => setUsername(text)}
            />
         <TextInput
              style={styles.input}
              placeholder="Change username"
              onChangeText={(text) => setUsername(text)}
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
    height: '70%',
    marginBottom: 10,
    padding: 30,
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
    fontSize: 16,
    margin: 5,
  },
  title: {
    color: 'white',
  }
});

export default ProfileScreen;
