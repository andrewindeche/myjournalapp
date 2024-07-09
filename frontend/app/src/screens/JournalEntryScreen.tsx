import React, { useState} from 'react';
import {  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu from '../components/Menu'

const JournalEntryScreen: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('Enter Your Title');
  const [description, setDescription] = useState(
    "Click on the description are and begin typing, save using the pencil icon"
  );
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

      const handleImageUpload = () => {
       
      };

    return (
      <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Icon name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showMenu && <Menu />}
      <View style={styles.content}>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
        {editMode ? (
          <>
          <ScrollView style={styles.content}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              style={styles.descriptionInput}
              multiline
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            </ScrollView>
          </>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </>
        )}
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Icon name="camera" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditMode(!editMode)}>
          <Icon name="pencil" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="ellipsis-horizontal" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="add-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E3F0F5',
      },
      date: {
        color: '#CB7723',
        fontWeight: 'bold',
        fontSize: 14
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
      },
      content: {
        flex: 1,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
      },
      descriptionInput: {
        fontSize: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        height: 300,
        backgroundColor: '#fff',
      },
      description: {
        fontSize: 16,
        marginBottom: 10,
      },
      expandedInput: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        height: 1000, 
      },
      subtitle: {
        fontSize: 16,
        marginBottom: 10,
      },
      listItem: {
        fontSize: 16,
        marginBottom: 5,
      },
      input: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
      },
  });
  
  export default JournalEntryScreen;