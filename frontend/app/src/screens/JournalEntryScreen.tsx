import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu from '../components/Menu';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';

interface JournalEntry {
  id: string;
  type: 'text' | 'image';
  content: string;
}

const JournalEntryScreen: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);
  const nextId = useRef(0);

  const handleImageUpload = () => {
    const options: ImageLibraryOptions = { mediaType: 'photo' };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        if (uri) {
          const newEntry: JournalEntry = { id: `${nextId.current++}`, type: 'image', content: uri };
          setJournalEntries((prevEntries) => [...prevEntries, newEntry]);
        }
      }
    });
  };

  const handleTakePhoto = () => {
    const options: CameraOptions = { mediaType: 'photo', cameraType: 'back' };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        if (uri) {
          const newEntry: JournalEntry = { id: `${nextId.current++}`, type: 'image', content: uri };
          setJournalEntries((prevEntries) => [...prevEntries, newEntry]);
        }
      }
    });
  };

  const handleAddEntry = () => {
    if (inputText) {
      const newEntry: JournalEntry = { id: `${nextId.current++}`, type: 'text', content: inputText };
      if (editEntryId !== null) {
        setJournalEntries((prevEntries) =>
          prevEntries.map(entry => entry.id === editEntryId ? newEntry : entry)
        );
        setEditEntryId(null);
      } else {
        setJournalEntries((prevEntries) => [...prevEntries, newEntry]);
      }
      setInputText('');
      setEditMode(false);
    } else {
      Alert.alert("Input Text is empty", "Please add some text or image before saving.");
    }
  };

  const handleEditEntry = (id: string) => {
    const entryToEdit = journalEntries.find(entry => entry.id === id);
    if (entryToEdit) {
      setInputText(entryToEdit.content);
      setEditEntryId(id);
      setEditMode(true);
    }
  };

  const handleDeleteAll = () => {
    setJournalEntries([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Icon name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showMenu && <Menu />}
      <View style={styles.content}>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
        {editMode ? (
          <>
            <TextInput
              style={styles.titleInput}
              value={title}
              placeholder="Add your title here..."
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              style={styles.entryInput}
              multiline
              placeholder="Add your note here..."
              value={inputText}
              onChangeText={(text) => setInputText(text)}
            />
            <TouchableOpacity onPress={handleAddEntry} style={styles.addButton}>
              <Text style={styles.addButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <FlatList
              data={journalEntries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={styles.entryContainer}
                    onPress={() => handleEditEntry(item.id)}
                  >
                    {item.type === 'text' ? (
                      <Text style={styles.listItem}>{item.content}</Text>
                    ) : (
                      <Image source={{ uri: item.content }} style={styles.entryImage} />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleTakePhoto}>
          <Icon name="camera" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditMode(!editMode)}>
          <Icon name="pencil" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteAll}>
          <Icon name="trash-bin" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImageUpload}>
          <Icon name="add-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F0F5',
  },
  date: {
    color: '#CB7723',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  entryContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#E3F0F5',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  content: {
    flex: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  title : {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#E3F0F5',
  },
  entryInput: {
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    height: 400,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#CB7723',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  entryImage: {
    width: '60%',
    height: 100,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});

export default JournalEntryScreen;
