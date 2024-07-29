import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {
  fetchJournalEntries,
  fetchCategories,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "../redux/JournalEntrySlice";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import SubMenu from "../components/JournalEntryMenu";
import { useNavigation } from "@react-navigation/native";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
} from "react-native-image-picker";
import ProgressOverlay from '../components/ProgressOverlay';

interface JournalEntry {
  id: string;
  type?: "text" | "image";
  content: (string | { uri: string })[];
  title: string;
  category: string;
  created_at: string;
}

const JournalEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { journalEntries, mostRecentEntry } = useSelector(
    (state: RootState) => state.entries,
  );
  const [newCategory, setNewCategory] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editMode && mostRecentEntry) {
      setTitle(mostRecentEntry.title);
      setSelectedCategory(mostRecentEntry.category);
      const entryContent = Array.isArray(mostRecentEntry.content) ? mostRecentEntry.content : [mostRecentEntry.content];
      const textContent = entryContent
        .filter((item) => typeof item === 'string')
        .join(' ');
      const imageContent = entryContent.filter(
        (item) => typeof item === 'object' && item.uri
      ) as { uri: string }[];
  
      setInputText(textContent);
      setImageUri(imageContent.length > 0 ? imageContent[0].uri : null);
    }
  }, [editMode, mostRecentEntry]);

  const handleImageUpload = () => {
    const options: ImageLibraryOptions = { mediaType: 'photo' };
  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const uri = response.assets && response.assets[0].uri;
      if (uri && editEntryId) {
        setImageUri(uri); 
        const updatedEntry = {
          ...mostRecentEntry,
          content: [...(Array.isArray(mostRecentEntry.content) ? mostRecentEntry.content : [mostRecentEntry.content]), { uri }],
        };
        dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }));
      }
    }
  });
  };

  const handleTakePhoto = () => {
    setUploading(true);
    const options: CameraOptions = { mediaType: "photo", cameraType: "back" };
    launchCamera(options, (response) => {
      setUploading(false);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        if (uri && editEntryId) {
          setImageUri(uri);
          const updatedEntry = {
            ...mostRecentEntry,
            content: [...mostRecentEntry.content, { uri }],
          };
          dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }));
        }
      }
    });
  };

  const handleAddEntry = () => {
    if (inputText || imageUri) {
      const newEntry: Omit<JournalEntry, "id" | "created_at"> = {
        type: "text",
        content: [
          ...(inputText ? [inputText] : []),
          ...(imageUri ? [{ uri: imageUri }] : []),
        ],
        title: title || mostRecentEntry.title,
        category: selectedCategory || newCategory,
      };
  
      if (editEntryId) {
        dispatch(updateJournalEntry({ id: editEntryId, ...newEntry }));
        setEditEntryId(null);
      } else {
        dispatch(createJournalEntry(newEntry));
      }
  
      setInputText("");
      setTitle("");
      setSelectedCategory(null);
      setNewCategory("");
      setEditMode(false);
      setImageUri(null);
    } else {
      Alert.alert(
        "Input Text is empty",
        "Please add some text or image before saving.",
      );
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditEntryId(entry.id);
    setEditMode(true);
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (showMenu) {
      timer = setTimeout(() => {
        setShowMenu(false);
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showMenu]);

  const handleDeleteAll = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    const deletePromises = journalEntries.map((entry) =>
      dispatch(deleteJournalEntry(entry.id)).unwrap(),
    );
    Promise.all(deletePromises)
      .then(() => {
        console.log('All entries deleted successfully');
      })
      .catch((error) => {
        console.error('Failed to delete some entries:', error);
      });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <ConfirmDeleteModal 
        isOpen={showDeleteModal} 
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
      />
    {uploading && <ProgressOverlay />}
      <View style={styles.content}>
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
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.entryImage} />
            )}
            <TextInput
              style={styles.categoryInput}
              value={selectedCategory || newCategory}
              placeholder="Enter category"
              onChangeText={(text) => setSelectedCategory(text)}
            />
            <Pressable onPress={handleAddEntry} style={styles.addButton}>
              <Text style={styles.addButtonText}>Save Changes</Text>
            </Pressable>
          </>
        ) : (
          <ScrollView>
            {mostRecentEntry ? (
              <Pressable
                style={styles.entryContainer}
                onPress={() => handleEditEntry(mostRecentEntry)}
              >
                <Text style={styles.date}>
                  {new Date(mostRecentEntry.created_at).toDateString()}
                </Text>
                <Text style={styles.title}>{mostRecentEntry.title}</Text>
                <Text style={styles.category}>Category: {mostRecentEntry.category}</Text>
                {Array.isArray(mostRecentEntry.content) ? (
                mostRecentEntry.content.map((item, index) => {
                  if (typeof item === 'string') {
                    return (
                      <Text key={index} style={styles.content}>
                        {item.split('\n').map((line, lineIndex) => (
                          <Text key={lineIndex}>{line}{'\n'}</Text>
                        ))}
                      </Text>
                    );
                  } else if (typeof item === 'object' && item.uri) {
                    return (
                      <Image
                        key={index}
                        source={{ uri: item.uri }}
                        style={styles.entryImage}
                      />
                    );
                  }
                  return null;
                })
                ) : (
                  <Text style={styles.content}>
                    {mostRecentEntry.content}
                  </Text>
                )}
              </Pressable>
            ) : (
              <Text>Click on the Pencil icon to Add an Entry</Text>
            )}
          </ScrollView>
        )}
      </View>
      <View style={styles.footer}>
        <Pressable onPress={handleTakePhoto}>
          <Icon name="camera" size={28} color="black" />
        </Pressable>
        <Pressable onPress={() => setEditMode(!editMode)}>
          <Icon name="pencil" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleDeleteAll}>
          <Icon name="trash-bin" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleImageUpload}>
          <Icon name="image" size={28} color="black" />
        </Pressable>
        <View style={styles.popup}>
          {showMenu && (
            <SubMenu navigation={navigation} onClose={handleToggleMenu} />
          )}
        </View>
        <Pressable onPress={handleToggleMenu}>
          <Icon name="menu" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    backgroundColor: "#02003d",
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  categoryInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    height: 50,
    marginBottom: 10,
    padding: 10,
  },
  container: {
    backgroundColor: "#e1e7f5",
    color: "white",
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    lineHeight: 25,
    paddingBottom: 10,
  },
  date: {
    color: "#CB7723",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 20,
  },
  entryContainer: {
    backgroundColor: "rgba(0, 0, 255, 0.1)",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    padding: 2,
  },
  entryImage: {
    height: 70,
    marginBottom: 10,
    width: 80,
    resizeMode: "contain",
  },
  entryInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    height: 600,
    marginBottom: 10,
    padding: 10,
  },
  footer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 60,
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  popup: {
    right: 10,
    backgroundColor: "#fff",
    marginBottom: 500,
    marginVertical: 45,
    position: "absolute",
  },
  title: {
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
  },
  titleInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  }
});

export default JournalEntryScreen;
