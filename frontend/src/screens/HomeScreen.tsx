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
          <Button type="button">Sign In</Button>
          <Button type="button">Register</Button>
        </View>
        </>
    )
}
