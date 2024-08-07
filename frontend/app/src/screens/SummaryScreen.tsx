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
import {
  fetchJournalEntries,
  fetchCategories,
} from "../redux/JournalEntrySlice";
import { RootState } from "../redux/store";
import { fetchProfileInfo } from "../redux/ProfileSlice";
import { JournalEntry } from "../types"; // Ensure this import matches your actual file location

const colorPalette = [
  "#FFDEE9",
  "#BDE0FE",
  "#FFEDCC",
  "#E4E5E6",
  "#C6F6D5",
  "#FED7D7",
];

const SummaryScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"title" | "keywords">("title");
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

  const renderEntry = ({
    item,
    index,
  }: {
    item: JournalEntry;
    index: number;
  }) => (
    <Pressable key={item.id} onPress={() => handleEntryPress(item)}>
      <View
        style={[styles.noteCard, { backgroundColor: getColorForIndex(index) }]}
      >
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteCategory}>{item.category}</Text>
        <Text style={styles.noteDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );

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
              <View style={styles.emptyDateFilterContainer}>
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
      <HomeMenu navigation={navigation} onDeleteAccount={() => {}} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002240",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingText: {
    color: "#e3e6f5",
    fontSize: 16,
  },
  title: {
    color: "#e3e6f5",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 10,
  },
  selectedCategoryButton: {
    color: "#000000",
  },
  categoryText: {
    color: "#cb7723",
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#222",
    color: "#e3e6f5",
  },
  searchTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchTypeButtonWrapper: {
    flex: 1,
  },
  searchTypeButton: {
    color: "#cb7723",
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    textAlign: "center",
  },
  selectedSearchType: {
    backgroundColor: "#666",
  },
  dateFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dateFilterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 10,
  },
  dateFilterButtonText: {
    color: "#cb7723",
    fontSize: 16,
  },
  notesContainer: {
    paddingBottom: 20,
  },
  noteCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 14,
    color: "rgb(25,121,169)",
    marginBottom: 5,
  },
  noteCategory: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#964B00",
  },
  loadingText: {
    color: "#cb7723",
    textAlign: "center",
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#e3e6f5",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyInstruction: {
    color: "#e3e6f5",
    fontSize: 16,
    textAlign: "center",
  },
  emptyClickInstruction: {
    color: "#000000",
    fontSize: 8,
  },
});

export default SummaryScreen;
