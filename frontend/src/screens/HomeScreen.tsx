import React from 'react';
import { Text, View, StyleSheet,Button } from 'react-native';

export default function HomeScreen() {
    return(
    <>
    <View>
        <Text>Everyday has a Story!</Text>
        <Text>Write Yours</Text>
      </View>
      <View>
          <Button title="Login" onPress={() => console.log('Button pressed')} />
          <Button title="Login" onPress={() => console.log('Button pressed')} />
        </View>
        </>
    )
}
