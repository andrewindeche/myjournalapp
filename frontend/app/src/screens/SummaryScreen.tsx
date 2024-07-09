import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SummaryScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Important', 'Bookmarked'];
  const notes = [
    {
      id: '1',
      title: 'Buy honey 100% original',
      description: 'Buy the new brand honey for my family. Here is the pic.',
      backgroundColor: '#FFDEE9',
      image: 'https://example.com/honey.jpg',
    },
    {
      id: '2',
      title: 'Tax payment before the end of March',
      description:
        'This is a reminder note, so as not to forget to pay taxes before the end of March. Don\'t miss it, you could be fined!\n\nList of assets that must be reported.',
      backgroundColor: '#BDE0FE',
    },
    {
      id: '3',
      title: 'Password WiFi gelato cafe near the station',
      description:
        'WiFi indoor: to reset the wifi password on time to don\'t get confusion after every time change.\n\nThis is a gentle reminder.',
      backgroundColor: '#FFEDCC',
    },
  ];

  const renderNote = ({ item }: { item: typeof notes[0] }) => (
    <View style={[styles.noteCard, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDescription}>{item.description}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.noteImage} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://example.com/profile.jpg' }} style={styles.profileImage} />
          <Text style={styles.greetingText}>Hi, Andrew</Text>
        </View>
        <TouchableOpacity>
          <Icon name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>My Notes</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  selectedCategoryButton: {
    backgroundColor: '#666',
  },
  categoryText: {
    color: 'white',
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  noteImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default SummaryScreen;
