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
import EntryMenu from "../components/EntryMenu";
import { useNavigation } from "@react-navigation/native";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
} from "react-native-image-picker";

interface JournalEntry {
  id: string;
  type?: "text" | "image";
  content: unknown;
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

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleImageUpload = () => {
    const options: ImageLibraryOptions = { mediaType: "photo" };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0].uri;
        if (uri && editEntryId) {
          const updatedEntry = {
            content: Array.isArray(mostRecentEntry.content)
              ? [...mostRecentEntry.content, uri]
              : [mostRecentEntry.content, uri],
          };
          dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }));
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
        const uri = response.assets && response.assets[0].uri;
        if (uri && editEntryId) {
          const updatedEntry = {
            ...mostRecentEntry,
            content: [...(mostRecentEntry.content as string[]), uri],
          };
          dispatch(updateJournalEntry({ id: editEntryId, ...updatedEntry }));
        }
      }
    });
  };

  const handleAddEntry = () => {
    if (inputText || newCategory) {
      const newEntry: Omit<JournalEntry, "id" | "created_at"> = {
        type: editEntryId ? mostRecentEntry.type : "text",
        content: inputText || mostRecentEntry.content,
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
    } else {
      Alert.alert(
        "Input Text is empty",
        "Please add some text or image before saving.",
      );
    }
  };

  const handleEditEntry = (id: string) => {
    const entryToEdit = journalEntries.find((entry) => entry.id === id);
    if (entryToEdit) {
      setInputText(entryToEdit.content as string);
      setTitle(entryToEdit.title);
      setSelectedCategory(entryToEdit.category);
      setEditEntryId(id);
      setEditMode(true);
    }
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

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
            <TextInput
              style={styles.categoryInput}
              value={newCategory}
              placeholder="Enter new category"
              onChangeText={(text) => setNewCategory(text)}
            />
            <Pressable onPress={handleAddEntry} style={styles.addButton}>
              <Text style={styles.addButtonText}>Save Changes</Text>
            </Pressable>
          </>
        ) : (
          <>
            {" "}
            <ScrollView>
              {mostRecentEntry ? (
                <Pressable
                  style={styles.entryContainer}
                  onPress={() => handleEditEntry(mostRecentEntry.id)}
                >
                  <Text style={styles.date}>
                    {new Date(mostRecentEntry.created_at).toDateString()}
                  </Text>
                  <Text style={styles.title}>{mostRecentEntry.title}</Text>
                  <Text style={styles.content}>{mostRecentEntry.content}</Text>
                  <Text style={styles.title}>{mostRecentEntry.category}</Text>
                  {mostRecentEntry.type === "text" ? (
                    <>
                      <Text style={styles.listItem}>
                        {mostRecentEntry.content}
                      </Text>
                      <Text style={styles.listItem}>
                        {mostRecentEntry.category}
                      </Text>
                    </>
                  ) : (
                    <Image
                      source={{ uri: mostRecentEntry.content }}
                      style={styles.entryImage}
                    />
                  )}
                </Pressable>
              ) : (
                <Text>Click on the Pencil icon to Add an Entry</Text>
              )}
            </ScrollView>
          </>
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
          <Icon name="add-circle" size={28} color="black" />
        </Pressable>
        <View style={styles.popup}>
          {showMenu && (
            <EntryMenu navigation={navigation} onClose={handleToggleMenu} />
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
    backgroundColor: "#E3F0F5",
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
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
    backgroundColor: "#E3F0F5",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    padding: 2,
  },
  entryImage: {
    height: "100%",
    marginBottom: 10,
    width: "60%",
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
});

export default JournalEntryScreen;
