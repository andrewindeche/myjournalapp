import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchProfileInfo, updateUsername, resetProfileState } from '../redux/ProfileSlice';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { username, email, profileImage, status, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  const handleUsernameChange = (newUsername: string) => {
    dispatch(updateUsername(newUsername));
  };

  const handleSaveChanges = () => {
    // Implement save changes for other fields like password and profile image
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity>
        </TouchableOpacity>
        <Text>Personal Information</Text>
        <TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', padding: 16 }}>
        <Text>Name</Text>
        <Text>user@website.com</Text>
      </View>
      </View>

      <View style={styles.innerContainer}>
      <Text style={styles.label}>Username</Text>
      <View style={{ paddingHorizontal: 16 }}>
      <TextInput
        style={styles.input}
        placeholder="Username"
      />

<Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button}  onPress={handleSaveChanges} disabled={status === 'loading'}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      </View>
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
});


export default ProfileScreen;
