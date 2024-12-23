import React, { useState, useEffect } from "react";
import { Colors } from "../colors";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
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
import { StackNavigationProp } from "@react-navigation/stack";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import SubMenu from "../components/JournalEntryMenu";
import { useRoute, useNavigation } from "@react-navigation/native";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
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
  entryId: number;
  category: string;
  created_at: string;
  content_text?: string;
  content_image?: { uri: string; name: string } | null;
}

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
  Profile: undefined;
  Summary: undefined;
  JournalEntry: undefined;
  Fallback: undefined;
  NotFound: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList, "JournalEntry">;
type Props = { navigation: NavigationProp };

const JournalEntryScreen: React.FC<Props> = () => {
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
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [entryIdToDelete, setEntryIdToDelete] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(Colors.background);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);

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

  useEffect(() => {
    const isDisabled = !(title && inputText && selectedCategory);
    setIsSaveDisabled(isDisabled);
  }, [title, inputText, selectedCategory, imageUri]);

  useEffect(() => {
    setBackgroundColor(isDarkMode ? Colors.darkBackground : Colors.background);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const logger = (message: string, ...optionalParams: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(message, ...optionalParams);
      // eslint-disable-next-line no-console
      console.error(message, ...optionalParams);
    }
  };

  const getTheme = (isDarkMode: boolean) => {
    return {
      backgroundColor: isDarkMode
        ? Colors.darkMode.background
        : Colors.background,
      textColor: isDarkMode ? Colors.darkMode.text : Colors.text,
    };
  };

  const handleImageUpload = async () => {
    if (!editMode) return;
    setUploadingImage(true);
    const options: ImageLibraryOptions = { mediaType: "photo" };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        logger("User cancelled image picker");
      } else if (response.errorCode) {
        logger("ImagePicker Error: ", response.errorMessage);
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
      setUploadingImage(false);
    });
  };

  const handleTakePhoto = () => {
    if (!editMode) return;
    setTakingPhoto(true);
    const options: CameraOptions = { mediaType: "photo", cameraType: "back" };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        logger("User cancelled camera");
      } else if (response.errorCode) {
        logger("Camera Error: ", response.errorMessage);
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
      setTakingPhoto(false);
    });
  };

  const handleAddEntry = async () => {
    if (inputText || imageUri) {
      const newEntry: Omit<JournalEntry, "id" | "created_at"> = {
        type: "text",
        content_text: inputText || "",
        content_image: imageUri ? { uri: imageUri, name: "image.png" } : null,
        title: title || (currentEntry ? currentEntry.title : ""),
        category: selectedCategory || newCategory,
      };

      try {
        if (editEntryId) {
          await dispatch(
            updateJournalEntry({ id: editEntryId, ...newEntry }),
          ).unwrap();
          dispatch(fetchJournalEntries());
          const updatedEntry = journalEntries.find((e) => e.id === editEntryId);
          setCurrentEntry(updatedEntry || null);
        } else {
          const result = await dispatch(createJournalEntry(newEntry)).unwrap();
          dispatch(fetchJournalEntries());
          setCurrentEntry(result);
          setEditEntryId(result.id);
        }
        resetForm();
      } catch (error) {
        logger("Failed to save entry:", error);
      }
    } else {
      Alert.alert(
        "Input Text is empty",
        "Please add some text or image before saving.",
      );
    }
  };

  const resetForm = () => {
    setEditEntryId(null);
    setEditMode(false);
    setImageUri(null);
    setInputText("");
    setTitle("");
    setSelectedCategory(null);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditEntryId(entry.id);
    setEditMode(true);
    setCurrentEntry(entry);
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

  const handleDeleteEntry = (entryId: number | null) => {
    if (entryId === null || entryId === undefined) {
      logger("Invalid entryId:", entryId);
      return;
    }
    setEntryIdToDelete(entryId);
    setModalOpen(true);
  };

  const confirmDeletion = () => {
    if (entryIdToDelete) {
      dispatch(deleteJournalEntry(entryIdToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchJournalEntries());
          setCurrentEntry(null);
          setEditMode(false);
          setInputText("");
          setTitle("");
          setSelectedCategory(null);
          setImageUri(null);
        })
        .catch((error) => {
          logger("Failed to delete entry:", error);
        })
        .finally(() => {
          setModalOpen(false);
          setEntryIdToDelete(null);
        });
    }
  };

  const cancelDeletion = () => {
    setModalOpen(false);
    setEntryIdToDelete(null);
  };

  const handleDeleteImage = () => {
    if (editEntryId && currentEntry) {
      const updatedEntry = {
        ...currentEntry,
        content_image: null,
      };
      dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }))
        .unwrap()
        .then(() => {
          setCurrentEntry(updatedEntry);
          setImageUri(null);
          Alert.alert("Image deleted successfully");
        })
        .catch((error) => {
          logger("Failed to delete image:", error);
          Alert.alert("Failed to delete image", error.message);
        });
    } else {
      Alert.alert("No image to delete or entry not found");
    }
  };

  const theme = getTheme(isDarkMode);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
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
            <View style={styles.iconRow}>
              <Pressable
                onPress={handleImageUpload}
                disabled={!editMode || uploadingImage}
              >
                <View style={styles.roundIconContainer}>
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Icon name="image" size={28} color="black" />
                  )}
                </View>
              </Pressable>
              <Pressable onPress={handleTakePhoto} disabled={takingPhoto}>
                <View style={styles.roundIconContainer}>
                  {takingPhoto ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Icon name="camera" size={28} color="black" />
                  )}
                </View>
              </Pressable>
            </View>
            <Pressable
              onPress={handleAddEntry}
              style={[
                styles.addButton,
                isSaveDisabled && { backgroundColor: Colors.gray },
              ]}
              disabled={isSaveDisabled}
            >
              <Text style={styles.addButtonText}>Save Changes</Text>
            </Pressable>
          </>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.scrollView,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            {currentEntry ? (
              <Pressable
                style={[
                  styles.entryContainer,
                  { backgroundColor: theme.backgroundColor },
                ]}
                onPress={() => handleEditEntry(currentEntry)}
              >
                <Text style={[styles.date, { color: theme.textColor }]}>
                  {new Date(currentEntry.created_at).toDateString()}
                </Text>
                <Text style={[styles.title, { color: theme.textColor }]}>
                  {currentEntry.title}
                </Text>
                <Text style={[styles.category, { color: theme.textColor }]}>
                  {currentEntry.category}
                </Text>
                {currentEntry.content_text && (
                  <Text style={[styles.content, { color: theme.textColor }]}>
                    {currentEntry.content_text}
                  </Text>
                )}
                {currentEntry.content_image?.uri ? (
                  <Image
                    source={{ uri: currentEntry.content_image.uri }}
                    style={styles.entryImage}
                  />
                ) : (
                  <Text style={{ color: theme.textColor }}>
                    No image available
                  </Text>
                )}
              </Pressable>
            ) : (
              <Text style={[styles.text, { color: theme.textColor }]}>
                <ul>
                  <li>Click on the Pencil icon to Add an Entry.</li>
                  <li>Click twice on pencil to start another entry.</li>
                </ul>
              </Text>
            )}
          </ScrollView>
        )}
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onConfirm={confirmDeletion}
          onCancel={cancelDeletion}
        />
      </View>
      <View style={styles.darkModeToggle}>
        <Pressable onPress={toggleDarkMode}>
          <Icon
            name={isDarkMode ? "moon" : "sunny"}
            size={28}
            color={isDarkMode ? "white" : "black"}
          />
        </Pressable>
        <Text style={[styles.toggleText, { color: theme.textColor }]}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
      </View>
      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            if (inputText || imageUri || title || selectedCategory) {
              resetForm();
            }
            setEditMode(true);
          }}
        >
          <Icon name="pencil" size={28} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            if (!editMode) {
              handleDeleteEntry(Number(currentEntry?.id) || null);
            }
          }}
          disabled={editMode}
          style={editMode && { backgroundColor: Colors.disabledGray }}
        >
          <Icon
            name="trash-bin"
            size={28}
            color="black"
            style={editMode ? styles.iconHidden : styles.icon}
          />
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
    backgroundColor: Colors.blue,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 4,
  },
  categoryInput: {
    backgroundColor: Colors.categoryInput,
    borderColor: Colors.borderColor,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    height: 50,
    marginBottom: 10,
    padding: 10,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    lineHeight: 25,
    paddingBottom: 10,
  },
  darkModeToggle: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  darkMode: {
    background: Colors.backgroundDarkMode,
    text: Colors.textDarkMode,
  },
  date: {
    color: Colors.color,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 4,
  },
  deleteImageButton: {
    backgroundColor: Colors.red,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  deleteImageButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  entryContainer: {
    backgroundColor: Colors.background,
    borderColor: Colors.borderColor,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    padding: 2,
  },
  entryImage: {
    height: 130,
    marginBottom: 10,
    resizeMode: "contain",
    width: 130,
  },
  entryInput: {
    backgroundColor: Colors.categoryInput,
    borderColor: Colors.borderColor,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    height: 600,
    marginBottom: 10,
    padding: 10,
  },
  footer: {
    alignItems: "center",
    backgroundColor: Colors.footer,
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    flexDirection: "row",
    height: 60,
    justifyContent: "space-around",
    padding: 10,
  },
  icon: {
    display: "flex",
    opacity: 1,
  },
  iconHidden: {
    display: "none",
    opacity: 0,
  },
  iconRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },
  popup: {
    backgroundColor: Colors.categoryInput,
    marginBottom: 500,
    marginVertical: 45,
    position: "absolute",
    right: 10,
  },
  roundIconContainer: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 50,
    height: 60,
    justifyContent: "center",
    padding: 10,
    width: 60,
  },
  text: {
    color: Colors.text,
  },
  title: {
    borderColor: Colors.borderColor,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 3,
  },
  titleInput: {
    backgroundColor: Colors.footer,
    borderColor: Colors.borderColor,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
  },
  toggleText: {
    color: Colors.black,
    fontSize: 18,
    marginLeft: 10,
  },
});

export default JournalEntryScreen;
