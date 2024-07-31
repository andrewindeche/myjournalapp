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
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
} from "react-native-image-picker";

interface JournalEntry {
  id: string;
  type?: "text" | "image";
  content: (string | { uri: string; caption?: string })[];
  title: string;
  category: string;
  created_at: string;
  content_text?: string;
  content_image?: { uri: string; name: string } | null;
}

const JournalEntryScreen: React.FC = () => {
  const route = useRoute();
  const entryId = route.params?.entryId || null;
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { journalEntries } = useSelector((state: RootState) => state.entries);
  const [newCategory, setNewCategory] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const entry = journalEntries.find((e) => e.id === entryId);
    if (entry) {
      setCurrentEntry(entry);
    }
  }, [entryId, journalEntries]);

  useEffect(() => {
    if (editMode && currentEntry) {
      setTitle(currentEntry.title || "");
      setSelectedCategory(currentEntry.category || "");
      setInputText(currentEntry.content_text || "");
      setImageUri(currentEntry.content_image?.uri || null);
    }
  }, [editMode, currentEntry]);

  const handleImageUpload = () => {
    const options: ImageLibraryOptions = { mediaType: "photo" };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0]?.uri;
          if (uri) {
            setImageUri(uri);
            if (currentEntry) {
              const updatedEntry = {
                ...currentEntry,
                content_image: {
                  uri,
                  name: response.assets[0]?.fileName || "image.png",
                },
              };
              dispatch(
                updateJournalEntry({ id: currentEntry.id, ...updatedEntry }),
              );
            }
          }
        }
      }
    });
  };

  const handleTakePhoto = () => {
    const options: CameraOptions = { mediaType: "photo", cameraType: "back" };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0]?.uri;
          if (uri && editEntryId) {
            setImageUri(uri);
            const updatedEntry = {
              ...currentEntry,
              content_image: {
                uri,
                name: response.assets[0]?.fileName || "image.png",
              },
            };
            dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }));
          }
        }
      }
    });
  };

  const handleAddEntry = () => {
    if (inputText || imageUri) {
      const newEntry: Omit<JournalEntry, "id" | "created_at"> = {
        type: "text",
        content_text: inputText || "",
        content_image: imageUri ? { uri: imageUri, name: "image.png" } : null,
        title: title || (currentEntry ? currentEntry.title : ""),
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
    const deletePromises = journalEntries.map((entry) =>
      dispatch(deleteJournalEntry(entry.id)).unwrap(),
    );

    Promise.all(deletePromises)
      .then(() => {
        console.log("All entries deleted successfully");
      })
      .catch((error) => {
        console.error("Failed to delete some entries:", error);
      });
  };

  const handleDeleteImage = () => {
    if (editEntryId && currentEntry) {
      const updatedEntry = {
        ...currentEntry,
        content_image: null,
      };

      dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }));
      setImageUri(null);
    }
  };

  return (
    <View style={styles.container}>
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
              <View>
                <Image source={{ uri: imageUri }} style={styles.entryImage} />
                <Pressable
                  onPress={handleDeleteImage}
                  style={styles.deleteImageButton}
                >
                  <Text style={styles.deleteImageButtonText}>Delete Image</Text>
                </Pressable>
              </View>
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
            {currentEntry ? (
              <Pressable
                style={styles.entryContainer}
                onPress={() => handleEditEntry(currentEntry)}
              >
                <Text style={styles.date}>
                  {new Date(currentEntry.created_at).toDateString()}
                </Text>
                <Text style={styles.title}>{currentEntry.title}</Text>
                <Text style={styles.category}>
                  Category: {currentEntry.category}
                </Text>
                {currentEntry.content_text && (
                  <Text style={styles.content}>
                    {currentEntry.content_text}
                  </Text>
                )}
                {currentEntry.content_image?.uri && (
                  <Image
                    source={{ uri: currentEntry.content_image.uri }}
                    style={styles.entryImage}
                    onError={() => console.log("Error loading image")}
                  />
                )}
              </Pressable>
            ) : (
              <Text>Click on the Pencil icon to Add an Entry</Text>
            )}
          </ScrollView>
        )}
      </View>
      <View style={styles.footer}>
        <Pressable onPress={() => setEditMode(!editMode)}>
          <Icon name="pencil" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleImageUpload}>
          <Icon name="image" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleTakePhoto}>
          <Icon name="camera" size={28} color="black" />
        </Pressable>
        <Pressable onPress={handleDeleteAll}>
          <Icon name="trash-bin" size={28} color="black" />
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
    backgroundColor: "#e3e6f5",
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    lineHeight: 25,
    paddingBottom: 10,
  },
  date: {
    color: "#cb7723",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 20,
  },
  entryContainer: {
    backgroundColor: "#e3e6f5",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    padding: 2,
  },
  entryImage: {
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
    width: 100,
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
  },
  deleteImageButton: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  deleteImageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default JournalEntryScreen;
