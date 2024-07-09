import React, { useState} from 'react';
import {  View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu from '../components/Menu'

const JournalEntryScreen: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

    const journalEntries = [
        'Audi RS7 sportback 5 seater',
        'Harley davidson street guide',
        'Lamborghini aventador',
        'Shopping of the downtown mall',
        'GST filing of the iPhone 14 pro max',
      ];

    return (
        <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Icon name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {showMenu && <Menu />}
        <View style={styles.content}>
          <Text style={styles.title}>Tax payment before the end of march</Text>
          <Text style={styles.description}>
            This is a reminder note, so as not to forget to pay taxes before the end of March. Don't miss it, you could be fined!
          </Text>
          <Text style={styles.subtitle}>
            List of assets that must be reported to the government, whether in the form of cash savings: that is mandatory things we have filling the tax payment to the government.
          </Text>
          <FlatList
            data={journalEntries}
            renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput style={styles.input} placeholder="Tap here to continue" />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity>
            <Icon name="camera" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
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
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
      description: {
        fontSize: 16,
        marginBottom: 10,
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