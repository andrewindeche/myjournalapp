import React from 'react';
import { Slot } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
    return(
    <NavigationContainer>
      <Slot />
    </NavigationContainer>
    )
}

export default App;