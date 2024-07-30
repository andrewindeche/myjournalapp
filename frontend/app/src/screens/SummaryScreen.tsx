import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import HomeMenu from "../components/HomeMenu";
import { fetchJournalEntries, fetchCategories } from "../redux/JournalEntrySlice";
import { RootState } from "../redux/store";
import JournalEntry from "../redux/JournalEntrySlice"; 

const colorPalette = [
  "#FFDEE9", "#BDE0FE", "#FFEDCC", "#E4E5E6", "#C6F6D5", "#FED7D7"
];
const SummaryScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const entries = useSelector((state: RootState) => state.entries.journalEntries);
  const categories = useSelector((state: RootState) => state.entries.categories);
  const status = useSelector((state: RootState) => state.entries.status);

  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchCategories());
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

  const filteredEntries = entries.filter((entry) =>
    selectedCategory === "All" || entry.category === selectedCategory
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: "https://example.com/profile.jpg" }}
              style={styles.profileImage}
            />
            <Text style={styles.greetingText}>Hi, Andrew</Text>
          </View>
        </View>
        <Text style={styles.title}>My Notes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
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
  categoryScroll: {
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
    backgroundColor: "#666",
  },
  categoryText: {
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
