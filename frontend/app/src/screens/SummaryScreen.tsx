import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import HomeMenu from "../components/HomeMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchJournalEntries,
  fetchCategories,
  deleteJournalEntry,
} from "../redux/JournalEntrySlice";
import { RootState } from "../redux/store";
import { fetchProfileInfo } from "../redux/ProfileSlice";
import { Colors } from "../colors";
import { Swipeable } from "react-native-gesture-handler";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const colorPalette = [
  "#FFDEE9",
  "#BDE0FE",
  "#FFEDCC",
  "#E4E5E6",
  "#C6F6D5",
  "#FED7D7",
  "#DBDAF8",
  "#E9DAF8",
  "#D1CDD1",
  "#FFFFFF",
];

const SummaryScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"title" | "keywords">("title");
  const [isModalVisible, setModalVisible] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleEntryPress = (entry: JournalEntry) => {
    navigation.navigate("JournalEntry", { entryId: entry.id });
  };

  const entries = useSelector(
    (state: RootState) => state.entries.journalEntries,
  );
  const status = useSelector((state: RootState) => state.entries.status);
  const username = useSelector((state: RootState) => state.profile.username);
  const profileStatus = useSelector((state: RootState) => state.profile.status);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchCategories());
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  const getColorForIndex = (index: number) =>
    colorPalette[index % colorPalette.length];

  const handleDeletePress = (entryId: number) => {
    setEntryToDelete(entryId);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete !== null) {
      dispatch(deleteJournalEntry(entryToDelete));
      setModalVisible(false);
      setEntryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setEntryToDelete(null);
  };

  const renderEntry = ({
    item,
    index,
  }: {
    item: JournalEntry;
    index: number;
  }) => {
    const renderRightActions = (progress: any, dragX: any) => (
      <Pressable
        style={styles.deleteAction}
        onPress={() => handleDeletePress(item.id)}
      >
        <MaterialCommunityIcons name="delete" size={24} color={Colors.white} />
      </Pressable>
    );

    const handleSwipeableRightOpen = () => {
      handleDeletePress(item.id);
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleSwipeableRightOpen}
      >
        <Pressable key={item.id} onPress={() => handleEntryPress(item)}>
          <View
            style={[
              styles.noteCard,
              { backgroundColor: getColorForIndex(index) },
            ]}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteCategory}>{item.category}</Text>
            <Text style={styles.noteDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesCategory =
      !selectedCategory || entry.category === selectedCategory;
    const matchesDate =
      dateFilter === 0 ||
      (new Date().getTime() - new Date(entry.created_at).getTime()) /
        (1000 * 60 * 60 * 24) <=
        dateFilter;
    const matchesTitle =
      searchType === "title"
        ? entry.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    const matchesContent =
      searchType === "keywords"
        ? (entry.content_text || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        : true;

    return (
      matchesCategory &&
      matchesDate &&
      (searchType === "title" ? matchesTitle : matchesContent)
    );
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            {profileStatus === "loading" ? (
              <Text style={styles.greetingText}>Loading...</Text>
            ) : (
              <Text style={styles.greetingText}>Hi, {username}</Text>
            )}
          </View>
        </View>
        <Text style={styles.title}>My Journals</Text>
        <View style={styles.filtersContainer}>
          <Pressable
            style={[
              styles.categoryButton,
              selectedCategory === null && styles.selectedCategoryButton,
            ]}
            onPress={() => {
              setSelectedCategory(null);
              setDateFilter(0);
            }}
          >
            <Text style={styles.categoryText}>All</Text>
          </Pressable>
          <Pressable
            style={[
              styles.categoryButton,
              selectedCategory === "date" && styles.selectedCategoryButton,
            ]}
            onPress={() => {
              setSelectedCategory(selectedCategory === "date" ? null : "date");
            }}
          >
            <Text style={styles.categoryText}>
              Date Filter:{" "}
              {dateFilter === 0 ? "All" : `Last ${dateFilter} day(s)`}
            </Text>
          </Pressable>
        </View>
        {selectedCategory === "date" && (
          <View style={styles.dateFilterContainer}>
            <Pressable
              onPress={() => setDateFilter((prev) => Math.max(prev - 1, 0))}
              style={styles.dateFilterButton}
            >
              <Text style={styles.dateFilterButtonText}>- Day</Text>
            </Pressable>
            <Pressable
              onPress={() => setDateFilter((prev) => prev + 1)}
              style={styles.dateFilterButton}
            >
              <Text style={styles.dateFilterButtonText}>+ Day</Text>
            </Pressable>
          </View>
        )}
        {selectedCategory === null && !dateFilter && (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
            <View style={styles.searchTypeContainer}>
              <Pressable
                onPress={() => setSearchType("title")}
                style={styles.searchTypeButtonWrapper}
              >
                <Text
                  style={[
                    styles.searchTypeButton,
                    searchType === "title" && styles.selectedSearchType,
                  ]}
                >
                  Title
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSearchType("keywords")}
                style={styles.searchTypeButtonWrapper}
              >
                <Text
                  style={[
                    styles.searchTypeButton,
                    searchType === "keywords" && styles.selectedSearchType,
                  ]}
                >
                  Keywords
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        {status === "loading" ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : filteredEntries.length === 0 ? (
          <View style={styles.emptyContainer}>
            {selectedCategory === "date" ? (
              <View>
                <Text style={styles.emptyText}>
                  No journals found for the selected date range.
                </Text>
                <Text style={styles.emptyInstruction}>
                  Use the "- Day" and "+ Day" buttons to adjust the date range.
                </Text>
                <Text style={styles.emptyInstruction}>
                  Click on the Date filter button again to view the entries
                </Text>
              </View>
            ) : (
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyText}>No journals found.</Text>
                <Text style={styles.emptyInstruction}>
                  Click on the note icon at the bottom of the screen to add a
                  new journal.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.notesContainer}
          />
        )}
      </View>
      <ConfirmDeleteModal
        isOpen={isModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <HomeMenu navigation={navigation} onDeleteAccount={() => {}} />
    </>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    backgroundColor: Colors.darkCharcoal,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryText: {
    color: Colors.color,
    fontSize: 16,
  },
  container: {
    backgroundColor: Colors.tangaroa,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  dateFilterButton: {
    backgroundColor: Colors.darkCharcoal,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dateFilterButtonText: {
    color: Colors.color,
    fontSize: 16,
  },
  dateFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
  },
  deleteAction: {
    alignItems: "center",
    backgroundColor: Colors.red,
    height: "100%",
    justifyContent: "center",
    padding: 20,
  },

  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
  },
  emptyInstruction: {
    color: Colors.background,
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    color: Colors.background,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  greetingText: {
    color: Colors.background,
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  loadingText: {
    color: Colors.color,
    marginTop: 20,
    textAlign: "center",
  },
  noteCard: {
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  noteCategory: {
    color: Colors.darkOrange,
    fontSize: 16,
    fontStyle: "italic",
  },
  noteDate: {
    color: Colors.LarimarBlue,
    fontSize: 14,
    marginBottom: 5,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notesContainer: {
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.mediumGray,
    borderRadius: 5,
    borderWidth: 1,
    color: Colors.background,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchTypeButton: {
    backgroundColor: Colors.darkCharcoal,
    borderRadius: 5,
    color: Colors.color,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
  },
  searchTypeButtonWrapper: {
    flex: 1,
  },
  searchTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedCategoryButton: {
    color: Colors.black,
  },
  selectedSearchType: {
    backgroundColor: Colors.darkGray,
  },
  title: {
    color: Colors.background,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SummaryScreen;
