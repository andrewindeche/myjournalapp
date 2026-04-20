import React, { useState, useEffect, useRef } from "react";
import { Colors } from "../colors";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
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
import { JournalEntry, EntryTheme, ENTRY_THEMES } from "../types";
import { API_URL } from "../redux/apiConfig";
import {
  saveTheme,
  loadTheme,
  setDarkMode as setDarkModeAction,
} from "../redux/authSlice";
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

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: object;
  inputStyle?: object;
  isDarkMode: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
  inputStyle,
  isDarkMode,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedValue]);

  const labelStyle = {
    position: "absolute" as const,
    left: 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 18 : 18, multiline ? 4 : 4],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? Colors.blue : "#999",
  };

  return (
    <View style={[styles.inputContainer, style]}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={[
          styles.floatingInput,
          inputStyle,
          {
            backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
            color: isDarkMode ? "#FFFFFF" : "#000000",
            textAlignVertical: multiline ? "top" : "center",
            minHeight: multiline ? 150 : 50,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={isFocused ? placeholder : ""}
        placeholderTextColor="#999"
        multiline={multiline}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

interface CategoryItem {
  id: number;
  name: string;
}

interface CategoryPickerProps {
  value: string;
  onChange: (text: string) => void;
  categories: CategoryItem[];
  isDarkMode: boolean;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onChange,
  categories,
  isDarkMode,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.categoryPickerContainer}>
      <Text style={[styles.pickerLabel, { color: isDarkMode ? "#AAA" : "#666" }]}>
        Category
      </Text>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
            borderColor: isDarkMode ? "#3A3A3C" : "#E5E5EA",
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text
          style={[
            styles.pickerButtonText,
            { color: value ? (isDarkMode ? "#FFF" : "#000") : "#999" },
          ]}
        >
          {value || "Select category"}
        </Text>
        <Icon name="chevron-down" size={20} color={isDarkMode ? "#AAA" : "#666"} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPicker(false)}
        >
          <View
            style={[
              styles.pickerModal,
              { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" },
            ]}
          >
            <View style={styles.pickerModalHeader}>
              <Text
                style={[
                  styles.pickerModalTitle,
                  { color: isDarkMode ? "#FFF" : "#000" },
                ]}
              >
                Select Category
              </Text>
              <Pressable onPress={() => setShowPicker(false)}>
                <Icon name="close" size={24} color={isDarkMode ? "#FFF" : "#000"} />
              </Pressable>
            </View>
            <ScrollView style={styles.pickerList}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.pickerItem,
                    {
                      backgroundColor:
                        value === cat.name
                          ? isDarkMode
                            ? "#3A3A3C"
                            : "#E5E5EA"
                          : "transparent",
                    },
                  ]}
                  onPress={() => {
                    onChange(cat.name);
                    setShowPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      {
                        color:
                          value === cat.name
                            ? Colors.blue
                            : isDarkMode
                            ? "#FFF"
                            : "#000",
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                  {value === cat.name && (
                    <Icon name="checkmark" size={20} color={Colors.blue} />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  { borderTopWidth: 1, borderTopColor: "#E5E5EA" },
                ]}
                onPress={() => {
                  onChange("");
                  setShowPicker(false);
                }}
              >
                <Text
                  style={[styles.pickerItemText, { color: Colors.red }]}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

interface FABProps {
  icon: string;
  onPress: () => void;
  loading?: boolean;
  color?: string;
  size?: "small" | "medium" | "large";
}

const FloatingActionButton: React.FC<FABProps> = ({
  icon,
  onPress,
  loading,
  color = Colors.blue,
  size = "medium",
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyles = {
    small: { width: 40, height: 40, iconSize: 18 },
    medium: { width: 50, height: 50, iconSize: 22 },
    large: { width: 60, height: 60, iconSize: 28 },
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.fab,
          {
            width: sizeStyles[size].width,
            height: sizeStyles[size].height,
            backgroundColor: color,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Icon
            name={icon}
            size={sizeStyles[size].iconSize}
            color="white"
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

interface ThemeSelectorProps {
  selectedTheme: EntryTheme;
  onSelect: (theme: EntryTheme) => void;
  isDarkMode: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelect,
  isDarkMode,
}) => {
  const themes = Object.keys(ENTRY_THEMES) as EntryTheme[];
  return (
    <View style={styles.themeSelectorContainer}>
      <Text style={[styles.pickerLabel, { color: isDarkMode ? "#AAA" : "#666" }]}>
        Theme
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themeScrollContent}
      >
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme}
            style={[
              styles.themeOption,
              {
                backgroundColor: ENTRY_THEMES[theme].background,
                borderColor:
                  selectedTheme === theme
                    ? Colors.blue
                    : isDarkMode
                    ? "#3A3A3C"
                    : "#E5E5EA",
                borderWidth: selectedTheme === theme ? 3 : 1,
              },
            ]}
            onPress={() => onSelect(theme)}
          >
            <View
              style={[
                styles.themeColorPreview,
                { backgroundColor: ENTRY_THEMES[theme].background },
              ]}
            >
              <Text
                style={[
                  styles.themeOptionText,
                  { color: ENTRY_THEMES[theme].text },
                ]}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const JournalEntryScreen: React.FC = () => {
  const route = useRoute();
  const entryId = route.params?.entryId || null;
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { journalEntries, categories } = useSelector(
    (state: RootState) => state.entries,
  );
  const operationLoading = useSelector(
    (state: RootState) => state.entries.operationLoading,
  );
  const isDarkModeRedux = useSelector(
    (state: RootState) => state.auth.isDarkMode,
  );
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeRedux);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [imagePosition, setImagePosition] = useState<"top" | "bottom">("bottom");
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<EntryTheme>("default");
  const [editMode, setEditMode] = useState(false);
  const [editEntryId, setEditEntryId] = useState<number | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [entryIdToDelete, setEntryIdToDelete] = useState<number | null>(null);
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
      setVideoUri(currentEntry.content_video?.uri || null);
      setSelectedTheme(currentEntry.theme || "default");
    }
  }, [entryId, currentEntry]);

  useEffect(() => {
    const isDisabled = !(title && inputText && selectedCategory);
    setIsSaveDisabled(isDisabled);
  }, [title, inputText, selectedCategory, imageUri, videoUri]);

  useEffect(() => {
    setIsDarkMode(isDarkModeRedux);
  }, [isDarkModeRedux]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    dispatch(setDarkModeAction(newMode));
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
              dispatch(updateJournalEntry({ id: currentEntry.id, ...updatedEntry }));
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
              dispatch(updateJournalEntry({ id: currentEntry.id, ...updatedEntry }));
            }
          }
        }
      }
      setTakingPhoto(false);
    });
  };

  const handleRecordVideo = () => {
    if (!editMode) return;
    setRecordingVideo(true);
    const options: CameraOptions = { mediaType: "video", cameraType: "back" };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        logger("User cancelled video recording");
      } else if (response.errorCode) {
        logger("Video Camera Error: ", response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset?.uri && asset?.type?.startsWith("video")) {
            setVideoUri(asset.uri);
            if (currentEntry) {
              const updatedEntry = {
                ...currentEntry,
                content_video: {
                  uri: asset.uri,
                  name: asset.fileName || "video.mp4",
                },
              };
              dispatch(updateJournalEntry({ id: currentEntry.id, ...updatedEntry }));
            }
          }
        }
      }
      setRecordingVideo(false);
    });
  };

  const handleSelectVideo = () => {
    if (!editMode) return;
    setRecordingVideo(true);
    const options: ImageLibraryOptions = { mediaType: "video" };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        logger("User cancelled video picker");
      } else if (response.errorCode) {
        logger("Video Picker Error: ", response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset?.uri && asset?.type?.startsWith("video")) {
            setVideoUri(asset.uri);
            if (currentEntry) {
              const updatedEntry = {
                ...currentEntry,
                content_video: {
                  uri: asset.uri,
                  name: asset.fileName || "video.mp4",
                },
              };
              dispatch(updateJournalEntry({ id: currentEntry.id, ...updatedEntry }));
            }
          }
        }
      }
      setRecordingVideo(false);
    });
  };

  const handleAddEntry = async () => {
    if (inputText || imageUri || videoUri) {
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
          ]),
        ),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
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

      const entryTheme = ENTRY_THEMES[selectedTheme];
      const newEntry: Omit<JournalEntry, "id" | "created_at"> = {
        type: videoUri ? "video" : "text",
        content_text: inputText || "",
        content_image: imageUri ? { uri: imageUri, name: "image.png" } : null,
        content_video: videoUri ? { uri: videoUri, name: "video.mp4" } : null,
        title: title || (currentEntry ? currentEntry.title : ""),
        category: selectedCategory || "",
        theme: selectedTheme,
        backgroundColor: entryTheme.background,
        textColor: entryTheme.text,
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
      Alert.alert("Empty Entry", "Please add some text, image, or video before saving.");
    }
  };

  const resetForm = () => {
    setEditEntryId(null);
    setEditMode(false);
    setImageUri(null);
    setVideoUri(null);
    setInputText("");
    setTitle("");
    setSelectedCategory(null);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditEntryId(Number(entry.id));
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
          Alert.alert("Success", "Image deleted successfully");
        })
        .catch((error) => {
          logger("Failed to delete image:", error);
          Alert.alert("Error", "Failed to delete image");
        });
    } else if (imageUri) {
      setImageUri(null);
    }
  };

  const handleDeleteVideo = () => {
    if (editEntryId && currentEntry) {
      const updatedEntry = {
        ...currentEntry,
        content_video: null,
      };
      dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }))
        .unwrap()
        .then(() => {
          setCurrentEntry(updatedEntry);
          setVideoUri(null);
          Alert.alert("Success", "Video deleted successfully");
        })
        .catch((error) => {
          logger("Failed to delete video:", error);
          Alert.alert("Error", "Failed to delete video");
        });
    } else if (videoUri) {
      setVideoUri(null);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000000" : "#F2F2F7" },
      ]}
    >
      {(operationLoading.fetchEntries ||
        operationLoading.fetchCategories ||
        operationLoading.deleteEntry) && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingSpinner,
                {
                  transform: [
                    { scale: pulseAnim },
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.loadingText}>Loading...</Text>
            </Animated.View>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {editMode ? (
          <View style={styles.formCard}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? "#FFF" : "#000" }]}>
              {editEntryId ? "Edit Entry" : "New Entry"}
            </Text>

            {imageUri && (
              <View style={styles.mediaPreview}>
                <DraggableImage uri={imageUri} />
                <View style={styles.mediaControls}>
                  <TouchableOpacity
                    style={styles.positionToggleBtn}
                    onPress={() => setImagePosition("top")}
                  >
                    <Text
                      style={[
                        styles.positionToggleText,
                        imagePosition === "top" && styles.positionToggleActive,
                      ]}
                    >
                      Top
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.positionToggleBtn}
                    onPress={() => setImagePosition("bottom")}
                  >
                    <Text
                      style={[
                        styles.positionToggleText,
                        imagePosition === "bottom" && styles.positionToggleActive,
                      ]}
                    >
                      Bottom
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteMediaBtn}
                    onPress={handleDeleteImage}
                  >
                    <Icon name="trash" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <FloatingLabelInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title..."
              isDarkMode={isDarkMode}
            />

            <FloatingLabelInput
              label="Write your thoughts..."
              value={inputText}
              onChangeText={setInputText}
              placeholder="Start writing..."
              multiline
              isDarkMode={isDarkMode}
              style={styles.inputSpacer}
            />

            {imageUri && imagePosition === "bottom" && (
              <View style={styles.mediaPreview}>
                <DraggableImage uri={imageUri} />
                <TouchableOpacity
                  style={styles.deleteMediaBtn}
                  onPress={handleDeleteImage}
                >
                  <Icon name="trash" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            {videoUri && (
              <View style={styles.mediaPreview}>
                <Video
                  source={{ uri: videoUri }}
                  style={styles.videoPlayer}
                  controls
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.deleteMediaBtn}
                  onPress={handleDeleteVideo}
                >
                  <Icon name="trash" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <CategoryPicker
              value={selectedCategory || ""}
              onChange={setSelectedCategory}
              categories={categories || []}
              isDarkMode={isDarkMode}
            />

            <ThemeSelector
              selectedTheme={selectedTheme}
              onSelect={setSelectedTheme}
              isDarkMode={isDarkMode}
            />

            <View style={styles.mediaButtonsRow}>
              <FloatingActionButton
                icon="image"
                onPress={handleImageUpload}
                loading={uploadingImage}
                color="#34C759"
              />
              <FloatingActionButton
                icon="camera"
                onPress={handleTakePhoto}
                loading={takingPhoto}
                color="#007AFF"
              />
              <FloatingActionButton
                icon="videocam"
                onPress={handleSelectVideo}
                loading={recordingVideo}
                color="#FF9500"
              />
              <FloatingActionButton
                icon="radio-button-on"
                onPress={handleRecordVideo}
                loading={recordingVideo}
                color="#FF3B30"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                isSaveDisabled && styles.saveButtonDisabled,
              ]}
              onPress={handleAddEntry}
              disabled={isSaveDisabled || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editEntryId ? "Update Entry" : "Save Entry"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.entriesContainer}>
            {currentEntry ? (
              <TouchableOpacity
                style={[
                  styles.entryCard,
                  { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" },
                ]}
                onPress={() => handleEditEntry(currentEntry)}
              >
                <View style={styles.entryHeader}>
                  <Text
                    style={[
                      styles.entryDate,
                      { color: isDarkMode ? "#8E8E93" : "#8E8E93" },
                    ]}
                  >
                    {new Date(currentEntry.created_at).toDateString()}
                  </Text>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor:
                          ENTRY_THEMES[currentEntry.theme || "default"]
                            .background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryBadgeText,
                        {
                          color:
                            ENTRY_THEMES[currentEntry.theme || "default"].text,
                        },
                      ]}
                    >
                      {currentEntry.category}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.entryTitle,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                >
                  {currentEntry.title}
                </Text>
                <Text
                  style={[
                    styles.entryContent,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                  numberOfLines={6}
                >
                  {currentEntry.content_text}
                </Text>
                {getFullImageUrl(
                  currentEntry.content_image?.uri ||
                    (currentEntry.content_image as string),
                ) && (
                  <View style={styles.entryImageContainer}>
                    <ZoomableImage
                      uri={
                        getFullImageUrl(
                          currentEntry.content_image?.uri ||
                            (currentEntry.content_image as string),
                        ) as string
                      }
                      style={styles.entryImage}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyState}>
                <Icon
                  name="create-outline"
                  size={80}
                  color={isDarkMode ? "#3A3A3C" : "#C7C7CC"}
                />
                <Text
                  style={[
                    styles.emptyStateTitle,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                >
                  Start Journaling
                </Text>
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: isDarkMode ? "#8E8E93" : "#8E8E93" },
                  ]}
                >
                  Tap the pencil icon below to create your first entry
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />

      <View style={[styles.footer, { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" }]}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={toggleDarkMode}
        >
          <Icon
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={isDarkMode ? "#FFF" : "#000"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.footerButton,
            styles.addButton,
            { backgroundColor: Colors.blue },
          ]}
          onPress={() => {
            if (inputText || imageUri || videoUri || title || selectedCategory) {
              resetForm();
            }
            setEditMode(true);
          }}
        >
          <Icon name="pencil" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            if (!editMode) {
              handleDeleteEntry(Number(currentEntry?.id) || null);
            }
          }}
          disabled={editMode}
        >
          <Icon
            name="trash-bin"
            size={24}
            color={editMode ? "#3A3A3C" : "#FF3B30"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleToggleMenu}>
          <Icon name="menu" size={24} color={isDarkMode ? "#FFF" : "#000"} />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View style={styles.menuOverlay}>
          <SubMenu navigation={navigation} onClose={handleToggleMenu} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  categoryPickerContainer: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  deleteMediaBtn: {
    backgroundColor: "#FF3B30",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
  },
  entryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  entryContainer: {
    backgroundColor: "#F2F2F7",
    marginBottom: 16,
  },
  entryContent: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  entryDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  entriesContainer: {
    padding: 16,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryImage: {
    borderRadius: 12,
    height: 200,
    width: "100%",
  },
  entryImageContainer: {
    marginTop: 12,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  fab: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  floatingInput: {
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#3A3A3C",
  },
  footerButton: {
    padding: 12,
  },
  formCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputSpacer: {
    marginTop: 8,
  },
  loadingContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  loadingSpinner: {
    alignItems: "center",
  },
  loadingText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  mediaButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 20,
  },
  mediaControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  mediaPreview: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuOverlay: {
    position: "absolute",
    right: 20,
    bottom: 160,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerButton: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pickerItemText: {
    fontSize: 18,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  pickerModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3A3A3C",
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  positionToggleActive: {
    color: Colors.blue,
    fontWeight: "700",
  },
  positionToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  positionToggleText: {
    fontSize: 14,
    color: "#666",
  },
  saveButton: {
    backgroundColor: Colors.blue,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  themeColorPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  themeOption: {
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    width: 80,
    height: 60,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  themeScrollContent: {
    paddingVertical: 8,
  },
  themeSelectorContainer: {
    marginBottom: 16,
  },
  videoPlayer: {
    height: 200,
    width: "100%",
  },
});

export default JournalEntryScreen;