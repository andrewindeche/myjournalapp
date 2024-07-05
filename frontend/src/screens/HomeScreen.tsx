import React from 'react';
import { Text, View, StyleSheet,Button } from 'react-native';

export default function HomeScreen() {
    return(
    <View style={styles.container}>
    <View style={styles.header}>
        <Text>Everyday has a Story!</Text>
        <Text>Write Yours</Text>
      </View>
      <View>
          <Button title="SignIn" onPress={() => {}} />
          <Button title="Register" onPress={() => {}} />
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
});
