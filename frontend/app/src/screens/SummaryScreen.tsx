import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import HomeMenu from "../components/HomeMenu";
import { fetchJournalEntries, fetchCategories } from "../redux/JournalEntrySlice";
import { RootState } from "../redux/store";
import { fetchProfileInfo } from "../redux/ProfileSlice";

const colorPalette = [
  "#FFDEE9", "#BDE0FE", "#FFEDCC", "#E4E5E6", "#C6F6D5", "#FED7D7"
];

const SummaryScreen: React.FC = () => {
  const [dateFilter, setDateFilter] = useState(0);
  const [titleSearch, setTitleSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const entries = useSelector((state: RootState) => state.entries.journalEntries);
  const categories = useSelector((state: RootState) => state.entries.categories);
  const status = useSelector((state: RootState) => state.entries.status);
  const username = useSelector((state: RootState) => state.profile.username);
  const profileStatus = useSelector((state: RootState) => state.profile.status);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchCategories());
    dispatch(fetchProfileInfo());
  }, [dispatch]);

  const getColorForIndex = (index: number) => colorPalette[index % colorPalette.length];

  const renderEntry = ({ item, index }: { item: JournalEntry, index: number }) => (
    <View
      style={[
        styles.noteCard,
        { backgroundColor: getColorForIndex(index) },
      ]}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      <Text style={styles.noteCategory}>{item.category}</Text>
    </View>
  );

  const filteredEntries = entries.filter((entry) => {
    const matchesDate = dateFilter === 0 || (new Date().getTime() - new Date(entry.created_at).getTime()) / (1000 * 60 * 60 * 24) <= dateFilter;
    const matchesTitle = titleSearch ? entry.title.toLowerCase().includes(titleSearch.toLowerCase()) : true;
    const matchesContent = contentSearch ? (entry.content_text || "").toLowerCase().includes(contentSearch.toLowerCase()) : true;

    return matchesDate && matchesTitle && matchesContent;
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            {profileStatus === 'loading' ? (
              <Text style={styles.greetingText}>Loading...</Text>
            ) : (
              <Text style={styles.greetingText}>Hi, {username}</Text>
            )}
          </View>
        </View>
        <Text style={styles.title}>My Journals</Text>
        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.categoryButton,
              styles.selectedCategoryButton,
            ]}
            onPress={() => setDateFilter(prev => (prev === 0 ? 1 : 0))}
          >
            <Text style={styles.categoryText}>All</Text>
          </Pressable>
          <Pressable
            style={styles.dateFilterButton}
            onPress={() => setDateFilter(prev => (prev === 0 ? 1 : 0))}
          >
            <Text style={styles.categoryText}>Date Filter: {dateFilter === 0 ? "All" : `Last ${dateFilter} day(s)`}</Text>
          </Pressable>
        </View>
        <TextInput
          placeholder="Search title..."
          value={titleSearch}
          onChangeText={setTitleSearch}
          style={styles.searchInput}
        />
        {dateFilter > 0 && (
          <View style={styles.dateFilterContainer}>
            <Pressable onPress={() => setDateFilter(prev => Math.max(prev - 1, 0))}>
              <Text style={styles.dateFilterButtonText}>- Day</Text>
            </Pressable>
            <Pressable onPress={() => setDateFilter(prev => prev + 1)}>
              <Text style={styles.dateFilterButtonText}>+ Day</Text>
            </Pressable>
          </View>
        )}
        {status === "loading" ? (
          <Text style={styles.loadingText}>Loading...</Text>
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
    backgroundColor: "#000",
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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#666",
  },
  categoryText: {
    color: "#cb7723",
    fontSize: 16,
  },
  searchInput: {
    height: 70,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#222",
    color: "#e3e6f5",
  },
  dateFilterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    marginLeft: 10,
  },
  dateFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dateFilterButtonText: {
    color: "#cb7723",
    fontSize: 16,
    marginHorizontal: 10,
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
    color: "#e3e6f5",
    marginBottom: 5,
  },
  noteCategory: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#fff",
  },
  loadingText: {
    color: "#cb7723",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SummaryScreen;
