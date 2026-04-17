import React, { useState, useEffect, useRef } from "react";
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
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppDispatch, RootState } from "../redux/store";
import {
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  fetchJournalEntries,
  fetchCategories,
} from "../redux/JournalEntrySlice";
import { JournalEntry } from "../redux/types";
import { API_URL } from "../redux/apiConfig";
import { saveTheme, loadTheme } from "../redux/authSlice";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SubMenu from "../components/JournalEntryMenu";
import ZoomableImage from "../components/ZoomableImage";
import DraggableImage from "../components/DraggableImage";

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
  const operationLoading = useSelector((state: RootState) => state.entries.operationLoading);
  const isDarkModeRedux = useSelector((state: RootState) => state.auth.isDarkMode);
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeRedux);
  const [newCategory, setNewCategory] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(Colors.background);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [imagePosition, setImagePosition] = useState<"top" | "bottom">("bottom");
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

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
    if (entryId && currentEntry) {
      setTitle(currentEntry.title || "");
      setSelectedCategory(currentEntry.category || "");
      setInputText(currentEntry.content_text || "");
      setImageUri(currentEntry.content_image?.uri || null);
    }
  }, [entryId, currentEntry]);

  useEffect(() => {
    const isDisabled = !(title && inputText && selectedCategory);
    setIsSaveDisabled(isDisabled);
  }, [title, inputText, selectedCategory, imageUri]);

  useEffect(() => {
    setBackgroundColor(isDarkMode ? Colors.darkBackground : Colors.background);
  }, [isDarkMode]);

  useEffect(() => {
    setIsDarkMode(isDarkModeRedux);
  }, [isDarkModeRedux]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    dispatch(saveTheme(newMode));
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

  const getFullImageUrl = (imagePath: string | undefined | null): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}${imagePath}`;
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
      setIsSaving(true);
      setSaveProgress(0);

      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          })
        ),
      ]).start();

      const progressInterval = setInterval(() => {
        setSaveProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 100);

      const newEntry: Omit<JournalEntry, "id" | "created_at"> = {
        type: "text",
        content_text: inputText || "",
        content_image: imageUri ? { uri: imageUri, name: "image.png" } : null,
        title: title || (currentEntry ? currentEntry.title : ""),
        category: selectedCategory || newCategory,
      };

      try {
        if (editEntryId) {
          const result = await dispatch(
            updateJournalEntry({ id: editEntryId, ...newEntry }),
          ).unwrap();
          dispatch(fetchJournalEntries());
          setCurrentEntry(result);
        } else {
          const result = await dispatch(createJournalEntry(newEntry)).unwrap();
          dispatch(fetchJournalEntries());
          setCurrentEntry(result);
          setEditEntryId(result.id);
        }
        clearInterval(progressInterval);
        setSaveProgress(100);
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          setIsSaving(false);
          setSaveProgress(0);
          resetForm();
        }, 300);
      } catch (error) {
        clearInterval(progressInterval);
        setIsSaving(false);
        setSaveProgress(0);
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
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
    } else if (imageUri) {
      setImageUri(null);
    } else {
      Alert.alert("No image to delete");
    }
  };

  const theme = getTheme(isDarkMode);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {(operationLoading.fetchEntries || operationLoading.fetchCategories || operationLoading.deleteEntry) && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingSpinner, { transform: [{ scale: pulseAnim }, { rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }]}>
              <Text style={styles.loadingText}>Loading...</Text>
            </Animated.View>
          </View>
        </View>
      )}
      <View style={styles.content}>
        {editMode ? (
          <>
            {imageUri && editMode && (
              <View style={styles.imagePositionContainer}>
                <View style={styles.positionToggle}>
                  <Pressable
                    style={[styles.positionButton, imagePosition === "top" && styles.positionButtonActive]}
                    onPress={() => setImagePosition("top")}
                  >
                    <Text style={[styles.positionButtonText, imagePosition === "top" && styles.positionButtonTextActive]}>Top</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.positionButton, imagePosition === "bottom" && styles.positionButtonActive]}
                    onPress={() => setImagePosition("bottom")}
                  >
                    <Text style={[styles.positionButtonText, imagePosition === "bottom" && styles.positionButtonTextActive]}>Bottom</Text>
                  </Pressable>
                </View>
                {imagePosition === "top" && (
                  <>
                    <DraggableImage uri={imageUri} />
                    <Pressable
                      onPress={handleDeleteImage}
                      style={styles.deleteImageButton}
                    >
                      <Text style={styles.deleteImageButtonText}>Delete Image</Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}
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
            {imageUri && editMode && imagePosition === "bottom" && (
              <View style={styles.imagePositionContainer}>
                <DraggableImage uri={imageUri} />
                <Pressable
                  onPress={handleDeleteImage}
                  style={styles.deleteImageButton}
                >
                  <Text style={styles.deleteImageButtonText}>Delete Image</Text>
                </Pressable>
              </View>
            )}
            <TextInput
              style={styles.entryInput}
              multiline
              placeholder="Add your note here..."
              value={inputText}
              onChangeText={(text) => setInputText(text)}
            />
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
            contentContainerStyle={[{ backgroundColor: theme.backgroundColor }]}
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
                {getFullImageUrl(currentEntry.content_image?.uri || currentEntry.content_image as string) ? (
                  <ZoomableImage
                    uri={getFullImageUrl(currentEntry.content_image?.uri || currentEntry.content_image as string) as string}
                    style={styles.entryImage}
                  />
                ) : null}
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
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  entryImage: {
    borderRadius: 8,
    height: 200,
    width: "100%",
  },
  previewImage: {
    borderRadius: 8,
    height: 150,
    width: "100%",
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
  imagePositionContainer: {
    marginVertical: 10,
  },
  positionToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  positionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: Colors.categoryInput,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  positionButtonActive: {
    backgroundColor: Colors.color,
    borderColor: Colors.color,
  },
  positionButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  positionButtonTextActive: {
    color: Colors.white,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  loadingSpinner: {
    alignItems: "center",
  },
  loadingText: {
    color: Colors.color,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default JournalEntryScreen;
