import React, {useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchProfileInfo, updateProfileImage, updatePassword, updateUsername } from '../redux/ProfileSlice';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { username, email, profileImage, status, error } = useSelector((state: RootState) => state.profile);
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  const handleUsernameChange = () => {
    if (newUsername.trim() !== '') {
      dispatch(updateUsername(newUsername.trim()));
      setNewUsername('');
    }
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
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={handleProfileImageChange}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', padding: 16 }}>
        <Text style={styles.label}>Name : {username}</Text>
        <Text style={styles.label}>Email: {email}</Text>
      </View>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Change Profile Image</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <TouchableOpacity style={styles.button}>
            <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,styles.uploadButton]} onPress={handleProfileImageChange}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>
          <TouchableOpacity onPress={handleSaveChanges} disabled={status === 'loading'}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

<Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
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
      <TouchableOpacity style={styles.button}  onPress={handleSaveChanges} disabled={status === 'loading'}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  outerContainer: {
    backgroundColor: '#020035',
    height: 20,
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
